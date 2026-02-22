from datetime import date
from decimal import Decimal
from pathlib import Path
import re

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )

    @event.listens_for(engine, "connect")
    def _enable_fk(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    TestingSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
        future=True,
    )

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def _create_produto(client: TestClient):
    response = client.post(
        "/produtos",
        json={
            "nome": "Hamburguer Artesanal",
            "preco": "25.00",
            "ativo": True,
            "estoque_atual": 50,
        },
    )
    assert response.status_code == 201
    return response.json()


def _create_adicional(client: TestClient):
    response = client.post(
        "/adicionais",
        json={
            "nome": "Bacon Extra",
            "preco": "5.00",
            "ativo": True,
        },
    )
    assert response.status_code == 201
    return response.json()


def _create_codigo(client: TestClient, codigo: str = "C-001"):
    response = client.post("/comandas/codigos", json={"codigo": codigo})
    assert response.status_code == 201
    return response.json()


def _abrir_comanda(client: TestClient, codigo: str = "C-001"):
    response = client.post(
        "/comandas/abrir",
        json={
            "codigo": codigo,
            "tipo_entrega": "RETIRADA",
            "observacoes": "Sem cebola",
        },
    )
    assert response.status_code == 201
    return response.json()


def test_mobile_and_caixa_pages(client: TestClient):
    mobile = client.get("/mobile")
    caixa = client.get("/caixa")
    assert mobile.status_code == 200
    assert caixa.status_code == 200
    assert "Anotar Pedido" in mobile.text
    assert "Fechamento de Caixa" in caixa.text


def test_mobile_nao_acessa_caixa(client: TestClient):
    resposta = client.get(
        "/caixa",
        headers={"user-agent": "Mozilla/5.0 (Linux; Android 13; Mobile)"},
        follow_redirects=False,
    )
    assert resposta.status_code in (302, 307, 308)
    assert resposta.headers["location"].startswith("/mobile")


def test_favicon_redirect(client: TestClient):
    response = client.get("/favicon.ico", follow_redirects=False)
    assert response.status_code in (302, 307, 308)
    assert response.headers["location"] == "/static/logo.png"


def test_mobile_and_caixa_textos_e_rodape(client: TestClient):
    mobile = client.get("/mobile")
    caixa = client.get("/caixa")
    assert mobile.status_code == 200
    assert caixa.status_code == 200

    # Confere acentuacao e footer default no HTML renderizado.
    assert "Anota\u00e7\u00e3o de Item" in mobile.text
    assert "Observa\u00e7\u00f5es r\u00e1pidas" in mobile.text
    assert "Op\u00e7\u00f5es de Interface" in mobile.text
    assert "Powered by PadariaERP" in mobile.text

    assert "C\u00f3digos de Comanda" in caixa.text
    assert "A\u00e7\u00f5es da comanda" in caixa.text
    assert "Salvar configura\u00e7\u00f5es" in caixa.text
    assert "Powered by PadariaERP" in caixa.text


def test_frontend_sem_mojibake():
    arquivos = [
        Path("app/templates/mobile.html"),
        Path("app/templates/caixa.html"),
        Path("app/static/mobile.js"),
        Path("app/static/caixa.js"),
    ]
    tokens_invalidos = ["Ãƒ", "Ã‚", "Ã°Å¸", "\ufffd"]
    for arquivo in arquivos:
        conteudo = arquivo.read_text(encoding="utf-8")
        for token in tokens_invalidos:
            assert token not in conteudo, f"{arquivo} contem token invalido: {token!r}"


def test_produto_com_foto_adicionais_edicao_e_exclusao(client: TestClient):
    adicional = _create_adicional(client)

    created = client.post(
        "/produtos",
        json={
            "nome": "Suco Detox",
            "categoria": "Bebida",
            "descricao": "Copo 300ml",
            "preco": "12.50",
            "ativo": True,
            "estoque_atual": 8,
            "adicional_ids": [adicional["id"]],
        },
    )
    assert created.status_code == 201
    produto = created.json()
    assert produto["categoria"] == "Bebida"
    assert produto["descricao"] == "Copo 300ml"
    assert produto["controla_estoque"] is True
    assert produto["adicional_ids"] == [adicional["id"]]

    upload = client.post(
        "/produtos/upload-imagem",
        files={"file": ("suco.png", b"fake-image-data", "image/png")},
    )
    assert upload.status_code == 200
    imagem_url = upload.json()["imagem_url"]
    assert imagem_url.startswith("/static/uploads/produtos/")

    updated = client.put(
        f"/produtos/{produto['id']}",
        json={
            "nome": "Suco Detox Verde",
            "categoria": "Bebida",
            "descricao": "Copo 500ml",
            "preco": "14.00",
            "ativo": True,
            "estoque_atual": 10,
            "controla_estoque": True,
            "imagem_url": imagem_url,
            "adicional_ids": [],
        },
    )
    assert updated.status_code == 200
    assert updated.json()["nome"] == "Suco Detox Verde"
    assert updated.json()["adicional_ids"] == []

    patch = client.patch(
        f"/produtos/{produto['id']}/estoque",
        json={"delta": -2},
    )
    assert patch.status_code == 200
    assert patch.json()["estoque_atual"] == 8

    deleted = client.delete(f"/produtos/{produto['id']}?hard=true")
    assert deleted.status_code == 200


def test_produto_sem_controle_estoque_nao_baixa_nem_repoe(client: TestClient):
    _create_codigo(client, "C-066")
    produto_resp = client.post(
        "/produtos",
        json={
            "nome": "Docinho Caixa",
            "categoria": "Doces",
            "preco": "3.50",
            "ativo": True,
            "estoque_atual": 0,
            "controla_estoque": False,
            "adicional_ids": [],
        },
    )
    assert produto_resp.status_code == 201
    produto = produto_resp.json()
    assert produto["controla_estoque"] is False
    assert produto["estoque_atual"] == 0

    comanda = _abrir_comanda(client, "C-066")
    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 3, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    em_preparo = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert em_preparo.status_code == 200

    after_prepare = client.get(f"/produtos/{produto['id']}")
    assert after_prepare.status_code == 200
    assert after_prepare.json()["estoque_atual"] == 0

    cancelada = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "CANCELADO", "repor_estoque": True},
    )
    assert cancelada.status_code == 200

    after_cancel = client.get(f"/produtos/{produto['id']}")
    assert after_cancel.status_code == 200
    assert after_cancel.json()["estoque_atual"] == 0


def test_comanda_with_adicionais_flow(client: TestClient):
    _create_codigo(client, "C-010")
    produto = _create_produto(client)
    adicional = _create_adicional(client)
    comanda = _abrir_comanda(client, "C-010")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={
            "produto_id": produto["id"],
            "quantidade": 2,
            "desconto": "3.00",
            "observacoes": "Ponto medio",
            "adicionais": [{"adicional_id": adicional["id"], "quantidade": 1}],
        },
    )
    assert add_item.status_code == 200
    payload = add_item.json()
    assert payload["comanda_codigo"] == "C-010"
    assert len(payload["itens"]) == 1
    assert payload["itens"][0]["adicionais"][0]["nome"] == "Bacon Extra"
    assert Decimal(str(payload["itens"][0]["desconto"])) == Decimal("3.00")
    assert Decimal(str(payload["total"])) == Decimal("52.00")

    cupom = client.get(f"/comandas/{comanda['id']}/cupom")
    assert cupom.status_code == 200
    assert "Comanda C-010" in cupom.text
    assert "Bacon Extra" in cupom.text
    assert "Desconto" in cupom.text


def test_comanda_agrega_adicionais_duplicados(client: TestClient):
    _create_codigo(client, "C-010D")
    produto = _create_produto(client)
    adicional = _create_adicional(client)
    comanda = _abrir_comanda(client, "C-010D")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={
            "produto_id": produto["id"],
            "quantidade": 1,
            "desconto": "0.00",
            "observacoes": "duplicado",
            "adicionais": [
                {"adicional_id": adicional["id"], "quantidade": 1},
                {"adicional_id": adicional["id"], "quantidade": 2},
            ],
        },
    )
    assert add_item.status_code == 200
    item = add_item.json()["itens"][0]
    assert len(item["adicionais"]) == 1
    assert item["adicionais"][0]["adicional_id"] == adicional["id"]
    assert item["adicionais"][0]["quantidade"] == 3
    assert Decimal(str(item["adicionais"][0]["subtotal"])) == Decimal("15.00")
    assert Decimal(str(item["subtotal"])) == Decimal("40.00")


def test_produto_hard_delete_remove_das_notas_quando_ja_usado(client: TestClient):
    _create_codigo(client, "C-099")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-099")
    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={
            "produto_id": produto["id"],
            "quantidade": 1,
            "observacoes": None,
            "adicionais": [],
        },
    )
    assert add_item.status_code == 200

    delete_resp = client.delete(f"/produtos/{produto['id']}?hard=true")
    assert delete_resp.status_code == 200
    payload = delete_resp.json()
    assert payload["id"] == produto["id"]

    produto_reload = client.get(f"/produtos/{produto['id']}")
    assert produto_reload.status_code == 404

    comanda_reload = client.get(f"/comandas/{comanda['id']}")
    assert comanda_reload.status_code == 200
    comanda_payload = comanda_reload.json()
    assert comanda_payload["itens"] == []
    assert Decimal(str(comanda_payload["total"])) == Decimal("0.00")

def test_adicional_crud_and_hard_delete(client: TestClient):
    created = client.post(
        "/adicionais",
        json={"nome": "Granola", "preco": "2.50", "ativo": True},
    )
    assert created.status_code == 201
    adicional = created.json()

    updated = client.put(
        f"/adicionais/{adicional['id']}",
        json={"nome": "Granola Premium", "preco": "3.00", "ativo": False},
    )
    assert updated.status_code == 200
    assert updated.json()["nome"] == "Granola Premium"
    assert updated.json()["ativo"] is False

    hard_delete = client.delete(f"/adicionais/{adicional['id']}?hard=true")
    assert hard_delete.status_code == 200


def test_adicional_hard_delete_remove_das_notas_se_ja_usado(client: TestClient):
    _create_codigo(client, "C-098")
    produto = _create_produto(client)
    adicional = _create_adicional(client)
    comanda = _abrir_comanda(client, "C-098")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={
            "produto_id": produto["id"],
            "quantidade": 1,
            "observacoes": None,
            "adicionais": [{"adicional_id": adicional["id"], "quantidade": 1}],
        },
    )
    assert add_item.status_code == 200

    hard_delete = client.delete(f"/adicionais/{adicional['id']}?hard=true")
    assert hard_delete.status_code == 200
    payload = hard_delete.json()
    assert payload["id"] == adicional["id"]

    adicional_reload = client.get(f"/adicionais/{adicional['id']}")
    assert adicional_reload.status_code == 404

    comanda_reload = client.get(f"/comandas/{comanda['id']}")
    assert comanda_reload.status_code == 200
    item = comanda_reload.json()["itens"][0]
    assert item["adicionais"] == []
    assert Decimal(str(item["subtotal"])) == Decimal("25.00")
    assert Decimal(str(comanda_reload.json()["total"])) == Decimal("25.00")

def test_adicionais_paginacao_offset_limit_e_busca(client: TestClient):
    for nome in ["Alho Fresco", "Cebola Crispy", "Ervas Finas"]:
        created = client.post(
            "/adicionais",
            json={"nome": nome, "preco": "1.50", "ativo": True},
        )
        assert created.status_code == 201

    paginada = client.get("/adicionais?offset=1&limit=2")
    assert paginada.status_code == 200
    payload = paginada.json()
    assert len(payload) == 2
    nomes = [row["nome"] for row in payload]
    assert nomes == sorted(nomes)

    busca = client.get("/adicionais?q=Ervas")
    assert busca.status_code == 200
    itens = busca.json()
    assert len(itens) == 1
    assert itens[0]["nome"] == "Ervas Finas"


def test_produtos_paginacao_multiplas_paginas(client: TestClient):
    total_produtos = 31
    for i in range(1, total_produtos + 1):
        created = client.post(
            "/produtos",
            json={
                "nome": f"Produto pagina {i:02d}",
                "preco": "2.50",
                "ativo": True,
                "estoque_atual": i,
            },
        )
        assert created.status_code == 201

    p1 = client.get("/produtos?page=1&page_size=12&ativo=true")
    p2 = client.get("/produtos?page=2&page_size=12&ativo=true")
    p3 = client.get("/produtos?page=3&page_size=12&ativo=true")

    assert p1.status_code == 200
    assert p2.status_code == 200
    assert p3.status_code == 200

    page1 = p1.json()
    page2 = p2.json()
    page3 = p3.json()

    assert page1["total"] == total_produtos
    assert page2["total"] == total_produtos
    assert page3["total"] == total_produtos
    assert len(page1["items"]) == 12
    assert len(page2["items"]) == 12
    assert len(page3["items"]) == 7
    assert page1["items"][0]["id"] > page1["items"][1]["id"]
    assert page2["items"][0]["id"] > page2["items"][1]["id"]
    assert page3["items"][0]["id"] > page3["items"][1]["id"]


def test_pagamentos_manual_and_maquininha(client: TestClient):
    _create_codigo(client, "C-020")
    _create_codigo(client, "C-020B")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-020")
    comanda_maq = _abrir_comanda(client, "C-020B")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200
    add_item_maq = client.post(
        f"/comandas/{comanda_maq['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item_maq.status_code == 200

    # Carrega comanda antes de pagamentos para exercitar cache de leitura.
    antes_pagamentos = client.get(f"/comandas/{comanda['id']}")
    assert antes_pagamentos.status_code == 200
    assert Decimal(str(antes_pagamentos.json()["pagamento"]["total_pago"])) == Decimal("0.00")

    pagamento_manual = client.post(
        "/pagamentos",
        json={
            "pedido_id": comanda["id"],
            "valor": "25.00",
            "metodo": "DINHEIRO",
        },
    )
    assert pagamento_manual.status_code == 201
    assert pagamento_manual.json()["status"] == "APROVADO"

    apos_pagamento_manual = client.get(f"/comandas/{comanda['id']}")
    assert apos_pagamento_manual.status_code == 200
    assert Decimal(str(apos_pagamento_manual.json()["pagamento"]["total_pago"])) == Decimal("25.00")
    assert Decimal(str(apos_pagamento_manual.json()["pagamento"]["saldo_pendente"])) == Decimal("0.00")

    pagamento_maq = client.post(
        "/pagamentos/maquininha/iniciar",
        json={
            "pedido_id": comanda_maq["id"],
            "valor": "25.00",
            "metodo": "CARTAO_DEBITO",
            "maquininha_id": "MAQ-1",
        },
    )
    assert pagamento_maq.status_code == 201
    maq_id = pagamento_maq.json()["id"]
    assert pagamento_maq.json()["status"] == "PENDENTE"

    confirma = client.patch(
        f"/pagamentos/maquininha/{maq_id}/confirmar",
        json={"aprovado": True, "referencia_externa": "NSU-123"},
    )
    assert confirma.status_code == 200
    assert confirma.json()["status"] == "APROVADO"

    detalhe = client.get(f"/comandas/{comanda_maq['id']}")
    assert detalhe.status_code == 200
    pagamento = detalhe.json()["pagamento"]
    assert Decimal(str(pagamento["total_pago"])) == Decimal("25.00")
    assert Decimal(str(pagamento["saldo_pendente"])) == Decimal("0.00")


def test_pagamento_exige_valor_exato(client: TestClient):
    _create_codigo(client, "C-020C")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-020C")
    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    menor = client.post(
        "/pagamentos",
        json={"pedido_id": comanda["id"], "valor": "24.00", "metodo": "DINHEIRO"},
    )
    assert menor.status_code == 400
    assert "exatamente igual ao saldo pendente" in menor.json()["detail"]

    maior = client.post(
        "/pagamentos/maquininha/iniciar",
        json={
            "pedido_id": comanda["id"],
            "valor": "26.00",
            "metodo": "CARTAO_DEBITO",
            "maquininha_id": "MAQ-X",
        },
    )
    assert maior.status_code == 400
    assert "exatamente igual ao saldo pendente" in maior.json()["detail"]


def test_sugestoes_mais_pedidos(client: TestClient):
    _create_codigo(client, "C-021")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-021")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 3, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    sugestoes = client.get("/comandas/sugestoes/mais-pedidos?limit=5")
    assert sugestoes.status_code == 200
    payload = sugestoes.json()
    assert len(payload) >= 1
    assert payload[0]["produto_id"] == produto["id"]
    assert payload[0]["quantidade_total"] >= 3


def test_comanda_status_and_release_code(client: TestClient):
    _create_codigo(client, "C-030")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-030")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 2, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    s1 = client.patch(f"/comandas/{comanda['id']}/status", json={"status": "EM_PREPARO"})
    s2 = client.patch(f"/comandas/{comanda['id']}/status", json={"status": "PRONTO"})
    s3 = client.patch(f"/comandas/{comanda['id']}/status", json={"status": "ENTREGUE"})
    assert s1.status_code == 200
    assert s2.status_code == 200
    assert s3.status_code == 200

    codigos = client.get("/comandas/codigos").json()
    c030 = [code for code in codigos if code["codigo"] == "C-030"][0]
    assert c030["em_uso"] is False
    assert c030["status_visual"] == "ENTREGUE"


def test_comanda_reabrir_entregue_exige_confirmacao_e_motivo(client: TestClient):
    _create_codigo(client, "C-032")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-032")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    em_preparo = client.patch(f"/comandas/{comanda['id']}/status", json={"status": "EM_PREPARO"})
    entregue = client.patch(f"/comandas/{comanda['id']}/status", json={"status": "ENTREGUE"})
    assert em_preparo.status_code == 200
    assert entregue.status_code == 200

    sem_confirmacao = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert sem_confirmacao.status_code == 400

    sem_motivo = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "EM_PREPARO", "confirmar_reabertura": True},
    )
    assert sem_motivo.status_code == 400

    com_motivo = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={
            "status": "EM_PREPARO",
            "confirmar_reabertura": True,
            "motivo_status": "Cliente solicitou ajuste",
        },
    )
    assert com_motivo.status_code == 200
    payload = com_motivo.json()
    assert payload["status"] == "EM_PREPARO"
    assert "Cliente solicitou ajuste" in (payload.get("observacoes") or "")

    codigos = client.get("/comandas/codigos").json()
    c032 = [code for code in codigos if code["codigo"] == "C-032"][0]
    assert c032["em_uso"] is True
    assert c032["status_visual"] == "EM_PREPARO"


def test_painel_comandas_e_liberacao_com_confirmacao(client: TestClient):
    _create_codigo(client, "C-310")
    _create_codigo(client, "C-311")

    aberta = _abrir_comanda(client, "C-310")
    status_entregue = client.patch(f"/comandas/{aberta['id']}/status", json={"status": "EM_PREPARO"})
    assert status_entregue.status_code == 400

    produto = _create_produto(client)
    add_item = client.post(
        f"/comandas/{aberta['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200
    s1 = client.patch(f"/comandas/{aberta['id']}/status", json={"status": "EM_PREPARO"})
    s2 = client.patch(f"/comandas/{aberta['id']}/status", json={"status": "ENTREGUE"})
    assert s1.status_code == 200
    assert s2.status_code == 200

    painel = client.get("/comandas/painel")
    assert painel.status_code == 200
    rows = painel.json()
    by_codigo = {row["codigo"]: row for row in rows}
    assert by_codigo["C-310"]["status"] == "ENTREGUE"
    assert by_codigo["C-311"]["status"] == "LIBERADO"

    codigo_310_id = by_codigo["C-310"]["codigo_id"]
    sem_confirmar = client.post(
        f"/comandas/codigos/{codigo_310_id}/liberar",
        json={"confirmar": False},
    )
    assert sem_confirmar.status_code == 400

    com_confirmar = client.post(
        f"/comandas/codigos/{codigo_310_id}/liberar",
        json={"confirmar": True},
    )
    assert com_confirmar.status_code == 200
    assert com_confirmar.json()["status_visual"] == "LIBERADO"


def test_comandas_filter_by_tipo_and_status(client: TestClient):
    _create_codigo(client, "C-060")
    _create_codigo(client, "C-061")
    _create_codigo(client, "C-062")
    response_mesa = client.post(
        "/comandas/abrir",
        json={"codigo": "C-060", "tipo_entrega": "RETIRADA", "mesa": "12", "observacoes": None},
    )
    assert response_mesa.status_code == 201
    response_sem_mesa = client.post(
        "/comandas/abrir",
        json={"codigo": "C-061", "tipo_entrega": "ENTREGA", "observacoes": None},
    )
    assert response_sem_mesa.status_code == 400
    assert "obrigat" in response_sem_mesa.json()["detail"].lower()

    response = client.post(
        "/comandas/abrir",
        json={"codigo": "C-062", "tipo_entrega": "ENTREGA", "mesa": "45", "observacoes": None},
    )
    assert response.status_code == 201

    entregas = client.get("/comandas?tipo_entrega=ENTREGA")
    assert entregas.status_code == 200
    payload = entregas.json()
    assert len(payload) >= 1
    assert all(row["tipo_entrega"] == "ENTREGA" for row in payload)

    abertas = client.get("/comandas?status=ABERTO")
    assert abertas.status_code == 200
    assert all(row["status"] == "ABERTO" for row in abertas.json())

    faixa_total = client.get("/comandas?total_min=0.01&total_max=999.99&order_by=codigo&order_dir=asc")
    assert faixa_total.status_code == 200
    rows = faixa_total.json()
    assert rows == sorted(rows, key=lambda r: r["comanda_codigo"])

    por_mesa = client.get("/comandas?mesa=12")
    assert por_mesa.status_code == 200
    assert len(por_mesa.json()) >= 1
    assert por_mesa.json()[0]["mesa"] == "12"


def test_comandas_paginacao_limit_offset(client: TestClient):
    _create_codigo(client, "C-090")
    _create_codigo(client, "C-091")
    _create_codigo(client, "C-092")
    _abrir_comanda(client, "C-090")
    _abrir_comanda(client, "C-091")
    _abrir_comanda(client, "C-092")

    paginada = client.get("/comandas?order_by=id&order_dir=asc&offset=1&limit=1")
    assert paginada.status_code == 200
    rows = paginada.json()
    assert len(rows) == 1
    assert rows[0]["id"] == 2
    assert rows[0]["comanda_codigo"] == "C-091"


def test_resetar_comandas_ativas(client: TestClient):
    _create_codigo(client, "C-070")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-070")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 2, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    em_preparo = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert em_preparo.status_code == 200

    produto_pos_baixa = client.get(f"/produtos/{produto['id']}")
    assert produto_pos_baixa.status_code == 200
    assert produto_pos_baixa.json()["estoque_atual"] == 48

    reset = client.post("/comandas/resetar-ativas")
    assert reset.status_code == 200
    payload = reset.json()
    assert payload["comandas_resetadas"] >= 1
    assert payload["codigos_liberados"] >= 1
    assert payload["estoque_reposto_total"] >= 2

    detalhe = client.get(f"/comandas/{comanda['id']}")
    assert detalhe.status_code == 404

    produto_reposto = client.get(f"/produtos/{produto['id']}")
    assert produto_reposto.status_code == 200
    assert produto_reposto.json()["estoque_atual"] == 50

    codigos = client.get("/comandas/codigos").json()
    c070 = [code for code in codigos if code["codigo"] == "C-070"][0]
    assert c070["em_uso"] is False
    assert c070["status_visual"] == "LIBERADO"


def test_resetar_comandas_ativas_tambem_liberar_codigos_cancelados(client: TestClient):
    _create_codigo(client, "C-073")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-073")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    cancelada = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "CANCELADO"},
    )
    assert cancelada.status_code == 200

    codigos = client.get("/comandas/codigos").json()
    c073 = [code for code in codigos if code["codigo"] == "C-073"][0]
    assert c073["status_visual"] == "CANCELADO"

    reset = client.post("/comandas/resetar-ativas")
    assert reset.status_code == 200
    payload = reset.json()
    assert payload["comandas_resetadas"] >= 1
    assert payload["codigos_liberados"] >= 1

    lista_pos = client.get("/comandas?limit=50")
    assert lista_pos.status_code == 200
    assert lista_pos.json() == []

    codigos_pos = client.get("/comandas/codigos?ativo=true&em_uso=false").json()
    c073_pos = [code for code in codigos_pos if code["codigo"] == "C-073"][0]
    assert c073_pos["status_visual"] == "LIBERADO"


def test_resetar_comandas_ativas_limpa_lista_e_liberar_todos_codigos(client: TestClient):
    _create_codigo(client, "C-074")
    _create_codigo(client, "C-075")
    produto = _create_produto(client)

    comanda_entregue = _abrir_comanda(client, "C-074")
    add_item = client.post(
        f"/comandas/{comanda_entregue['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200
    em_preparo = client.patch(
        f"/comandas/{comanda_entregue['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert em_preparo.status_code == 200
    entregue = client.patch(
        f"/comandas/{comanda_entregue['id']}/status",
        json={"status": "ENTREGUE"},
    )
    assert entregue.status_code == 200

    comanda_cancelada = _abrir_comanda(client, "C-075")
    cancelada = client.patch(
        f"/comandas/{comanda_cancelada['id']}/status",
        json={"status": "CANCELADO"},
    )
    assert cancelada.status_code == 200

    antes = client.get("/comandas?limit=100")
    assert antes.status_code == 200
    assert len(antes.json()) == 2

    reset = client.post("/comandas/resetar-ativas")
    assert reset.status_code == 200
    payload = reset.json()
    assert payload["comandas_resetadas"] >= 2
    assert payload["codigos_liberados"] >= 2

    depois = client.get("/comandas?limit=100")
    assert depois.status_code == 200
    assert depois.json() == []

    codigos = client.get("/comandas/codigos?ativo=true&em_uso=false").json()
    by_codigo = {row["codigo"]: row for row in codigos}
    assert by_codigo["C-074"]["status_visual"] == "LIBERADO"
    assert by_codigo["C-075"]["status_visual"] == "LIBERADO"


def test_reset_comanda_individual(client: TestClient):
    _create_codigo(client, "C-071A")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-071A")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 2, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    em_preparo = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert em_preparo.status_code == 200

    reset_item = client.post(f"/comandas/{comanda['id']}/reset")
    assert reset_item.status_code == 200
    payload = reset_item.json()
    assert payload["pedido_id"] == comanda["id"]
    assert payload["status_anterior"] == "EM_PREPARO"
    assert payload["comanda_liberada"] is True
    assert payload["estoque_reposto_total"] >= 2

    detalhe = client.get(f"/comandas/{comanda['id']}")
    assert detalhe.status_code == 404

    codigos = client.get("/comandas/codigos").json()
    c071a = [code for code in codigos if code["codigo"] == "C-071A"][0]
    assert c071a["em_uso"] is False
    assert c071a["status_visual"] == "LIBERADO"


def test_excluir_comanda_definitivamente(client: TestClient):
    _create_codigo(client, "C-072")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-072")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 3, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    em_preparo = client.patch(
        f"/comandas/{comanda['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert em_preparo.status_code == 200

    estoque_baixado = client.get(f"/produtos/{produto['id']}")
    assert estoque_baixado.status_code == 200
    assert estoque_baixado.json()["estoque_atual"] == 47

    deleted = client.delete(f"/comandas/{comanda['id']}")
    assert deleted.status_code == 200
    payload = deleted.json()
    assert payload["comanda_id"] == comanda["id"]
    assert payload["itens_removidos"] >= 1
    assert payload["estoque_reposto_total"] >= 3

    not_found = client.get(f"/comandas/{comanda['id']}")
    assert not_found.status_code == 404

    estoque_reposto = client.get(f"/produtos/{produto['id']}")
    assert estoque_reposto.status_code == 200
    assert estoque_reposto.json()["estoque_atual"] == 50

    codigos = client.get("/comandas/codigos").json()
    c072 = [code for code in codigos if code["codigo"] == "C-072"][0]
    assert c072["em_uso"] is False


def test_alterar_comanda_em_preparo_entregue_e_mover_item(client: TestClient):
    _create_codigo(client, "C-080")
    _create_codigo(client, "C-081")
    produto_1 = _create_produto(client)
    produto_2_resp = client.post(
        "/produtos",
        json={
            "nome": "Suco de Laranja",
            "preco": "10.00",
            "ativo": True,
            "estoque_atual": 20,
        },
    )
    assert produto_2_resp.status_code == 201
    produto_2 = produto_2_resp.json()

    comanda_origem = _abrir_comanda(client, "C-080")
    comanda_destino = _abrir_comanda(client, "C-081")

    add_item = client.post(
        f"/comandas/{comanda_origem['id']}/itens",
        json={
            "produto_id": produto_1["id"],
            "quantidade": 2,
            "observacoes": None,
            "adicionais": [],
        },
    )
    assert add_item.status_code == 200
    item_id = add_item.json()["itens"][0]["id"]

    em_preparo = client.patch(
        f"/comandas/{comanda_origem['id']}/status",
        json={"status": "EM_PREPARO"},
    )
    assert em_preparo.status_code == 200

    estoque_produto_1 = client.get(f"/produtos/{produto_1['id']}")
    assert estoque_produto_1.status_code == 200
    assert estoque_produto_1.json()["estoque_atual"] == 48

    update_item = client.put(
        f"/comandas/{comanda_origem['id']}/itens/{item_id}",
        json={
            "produto_id": produto_2["id"],
            "quantidade": 1,
            "desconto": "0.00",
            "observacoes": "ajuste",
            "adicionais": [],
        },
    )
    assert update_item.status_code == 200

    estoque_produto_1 = client.get(f"/produtos/{produto_1['id']}")
    estoque_produto_2 = client.get(f"/produtos/{produto_2['id']}")
    assert estoque_produto_1.status_code == 200
    assert estoque_produto_2.status_code == 200
    assert estoque_produto_1.json()["estoque_atual"] == 50
    assert estoque_produto_2.json()["estoque_atual"] == 19

    item_atualizado_id = update_item.json()["itens"][0]["id"]
    move_item = client.post(
        f"/comandas/{comanda_origem['id']}/itens/{item_atualizado_id}/mover",
        json={"destino_pedido_id": comanda_destino["id"]},
    )
    assert move_item.status_code == 200
    assert move_item.json()["id"] == comanda_origem["id"]
    assert len(move_item.json()["itens"]) == 0

    destino_detalhe = client.get(f"/comandas/{comanda_destino['id']}")
    assert destino_detalhe.status_code == 200
    itens_destino = destino_detalhe.json()["itens"]
    assert len(itens_destino) == 1
    assert itens_destino[0]["produto_id"] == produto_2["id"]
    assert itens_destino[0]["quantidade"] == 1

    estoque_produto_2 = client.get(f"/produtos/{produto_2['id']}")
    assert estoque_produto_2.status_code == 200
    assert estoque_produto_2.json()["estoque_atual"] == 20

    entregue = client.patch(
        f"/comandas/{comanda_origem['id']}/status",
        json={"status": "ENTREGUE"},
    )
    assert entregue.status_code == 200

    add_item_entregue = client.post(
        f"/comandas/{comanda_origem['id']}/itens",
        json={
            "produto_id": produto_1["id"],
            "quantidade": 1,
            "observacoes": "retorno rapido",
            "adicionais": [],
        },
    )
    assert add_item_entregue.status_code == 200
    item_entregue_id = add_item_entregue.json()["itens"][0]["id"]

    estoque_produto_1 = client.get(f"/produtos/{produto_1['id']}")
    assert estoque_produto_1.status_code == 200
    assert estoque_produto_1.json()["estoque_atual"] == 49

    remove_item_entregue = client.delete(
        f"/comandas/{comanda_origem['id']}/itens/{item_entregue_id}"
    )
    assert remove_item_entregue.status_code == 200

    estoque_produto_1 = client.get(f"/produtos/{produto_1['id']}")
    assert estoque_produto_1.status_code == 200
    assert estoque_produto_1.json()["estoque_atual"] == 50


def test_faturamento_periodo(client: TestClient):
    _create_codigo(client, "C-071")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-071")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    pagamento = client.post(
        "/pagamentos",
        json={"pedido_id": comanda["id"], "valor": "25.00", "metodo": "PIX"},
    )
    assert pagamento.status_code == 201

    hoje = date.today().isoformat()
    faturamento = client.get(
        f"/relatorios/faturamento-periodo?data_inicial={hoje}&data_final={hoje}"
    )
    assert faturamento.status_code == 200
    payload = faturamento.json()
    assert payload["total_pedidos"] >= 1
    assert Decimal(str(payload["total_recebido"])) >= Decimal("25.00")
    assert len(payload["dias"]) == 1
    assert payload["dias"][0]["data"] == hoje
    assert "PIX" in payload["pagamentos_por_metodo"]

    csv_periodo = client.get(
        f"/relatorios/faturamento-periodo.csv?data_inicial={hoje}&data_final={hoje}"
    )
    assert csv_periodo.status_code == 200
    assert "text/csv" in csv_periodo.headers["content-type"]
    assert "total_recebido" in csv_periodo.text

    relatorio = client.get(
        f"/relatorios/faturamento-periodo/relatorio?data_inicial={hoje}&data_final={hoje}"
    )
    assert relatorio.status_code == 200
    assert "Relat\u00f3rio de Faturamento" in relatorio.text
    assert "PadariaERP" in relatorio.text


def test_fechamento_caixa_and_csv(client: TestClient):
    _create_codigo(client, "C-040")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-040")
    client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    client.post(
        "/pagamentos",
        json={
            "pedido_id": comanda["id"],
            "valor": "25.00",
            "metodo": "PIX",
        },
    )

    hoje = date.today().isoformat()
    fechamento = client.get(f"/relatorios/fechamento-caixa?data={hoje}")
    assert fechamento.status_code == 200
    payload = fechamento.json()
    assert "total_recebido" in payload
    assert Decimal(str(payload["total_recebido"])) >= Decimal("25.00")
    assert "PIX" in payload["pagamentos_por_metodo"]

    csv_resp = client.get(f"/relatorios/fechamento-caixa.csv?data={hoje}")
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "total_recebido" in csv_resp.text


def test_pagamentos_paginacao_limit_offset(client: TestClient):
    _create_codigo(client, "C-041")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-041")
    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={"produto_id": produto["id"], "quantidade": 1, "observacoes": None, "adicionais": []},
    )
    assert add_item.status_code == 200

    p1 = client.post(
        "/pagamentos/maquininha/iniciar",
        json={
            "pedido_id": comanda["id"],
            "valor": "25.00",
            "metodo": "CARTAO_DEBITO",
            "maquininha_id": "PAG-1",
        },
    )
    p2 = client.post(
        "/pagamentos/maquininha/iniciar",
        json={
            "pedido_id": comanda["id"],
            "valor": "25.00",
            "metodo": "CARTAO_DEBITO",
            "maquininha_id": "PAG-2",
        },
    )
    p3 = client.post(
        "/pagamentos/maquininha/iniciar",
        json={
            "pedido_id": comanda["id"],
            "valor": "25.00",
            "metodo": "CARTAO_DEBITO",
            "maquininha_id": "PAG-3",
        },
    )
    assert p1.status_code == 201
    assert p2.status_code == 201
    assert p3.status_code == 201

    recusa_1 = client.patch(
        f"/pagamentos/maquininha/{p1.json()['id']}/confirmar",
        json={"aprovado": False},
    )
    recusa_2 = client.patch(
        f"/pagamentos/maquininha/{p2.json()['id']}/confirmar",
        json={"aprovado": False},
    )
    assert recusa_1.status_code == 200
    assert recusa_2.status_code == 200

    paginada = client.get(f"/pagamentos?pedido_id={comanda['id']}&offset=1&limit=2")
    assert paginada.status_code == 200
    rows = paginada.json()
    assert len(rows) == 2
    assert rows[0]["id"] == 2
    assert rows[1]["id"] == 1


def test_erp_config_get_patch_reset(client: TestClient):
    get_resp = client.get("/config/erp")
    assert get_resp.status_code == 200
    current = get_resp.json()
    assert current["empresa_nome"] == "PadariaERP"
    assert current["tempo_real_segundos"] == 5
    assert current["permitir_status_pronto"] is False

    patch_resp = client.patch(
        "/config/erp",
        json={
            "empresa_nome": "Padaria Teste",
            "empresa_subtitulo": "ERP Ajustado",
            "tempo_real_segundos": 9,
            "tempo_real_ativo": False,
            "permitir_status_pronto": True,
            "finalizar_mobile_status": "PRONTO",
            "cor_primaria": "#112233",
            "cor_secundaria": "#223344",
            "cor_topo_primaria": "#334455",
            "cor_topo_secundaria": "#445566",
        },
    )
    assert patch_resp.status_code == 200
    patched = patch_resp.json()
    assert patched["empresa_nome"] == "Padaria Teste"
    assert patched["tempo_real_segundos"] == 9
    assert patched["tempo_real_ativo"] is False
    assert patched["permitir_status_pronto"] is True
    assert patched["finalizar_mobile_status"] == "PRONTO"
    assert patched["cor_primaria"] == "#112233"

    reset_resp = client.post("/config/erp/reset")
    assert reset_resp.status_code == 200
    reset_payload = reset_resp.json()
    assert reset_payload["empresa_nome"] == "PadariaERP"
    assert reset_payload["tempo_real_segundos"] == 5
    assert reset_payload["permitir_status_pronto"] is False
    assert reset_payload["finalizar_mobile_status"] == "EM_PREPARO"


def test_frontend_sem_mojibake_ampliado():
    arquivos = [
        Path("app/templates/mobile.html"),
        Path("app/templates/caixa.html"),
        Path("app/templates/comandas.html"),
        Path("app/templates/cupom.html"),
        Path("app/templates/cupom_comanda.html"),
        Path("app/static/mobile.js"),
        Path("app/static/caixa.js"),
        Path("app/static/comandas.js"),
    ]
    tokens_invalidos = ["\u00c3", "\u00c2", "\ufffd"]
    for arquivo in arquivos:
        conteudo = arquivo.read_text(encoding="utf-8")
        for token in tokens_invalidos:
            assert token not in conteudo, f"{arquivo} contem token invalido: {token!r}"


def test_app_sem_mojibake_geral():
    # Detecta padrÃµes tÃ­picos de texto UTF-8 quebrado (ex.: "minÃƒÂºsculo").
    padrao_mojibake = re.compile(r"(?:Ãƒ[\x80-\xBF]|Ã‚[\x80-\xBF]|Ã°Å¸|\ufffd)")
    extensoes = {".py", ".js", ".html", ".css"}
    encontrados: list[str] = []

    for arquivo in Path("app").rglob("*"):
        if arquivo.suffix.lower() not in extensoes:
            continue
        conteudo = arquivo.read_text(encoding="utf-8")
        if padrao_mojibake.search(conteudo):
            encontrados.append(str(arquivo))

    assert not encontrados, f"Arquivos com possÃ­vel mojibake: {encontrados}"


def test_templates_legados_com_acentuacao():
    comandas_html = Path("app/templates/comandas.html").read_text(encoding="utf-8")
    cupom_html = Path("app/templates/cupom.html").read_text(encoding="utf-8")

    assert "Cadastros R\u00e1pidos" in comandas_html
    assert "Endere\u00e7o" in comandas_html
    assert "Pre\u00e7o Unit." in comandas_html
    assert "A\u00e7\u00f5es" in comandas_html
    assert "V\u00e1lidos" in comandas_html
    assert "Hist\u00f3rico de Cupons" in comandas_html
    assert "N\u00e3o" in comandas_html
    assert "Buscar Hist\u00f3rico" in comandas_html

    assert "Observa\u00e7\u00f5es:" in cupom_html


def test_textos_js_acentuados_essenciais():
    mobile_js = Path("app/static/mobile.js").read_text(encoding="utf-8")
    caixa_js = Path("app/static/caixa.js").read_text(encoding="utf-8")
    comandas_js = Path("app/static/comandas.js").read_text(encoding="utf-8")

    assert "Item n\u00e3o encontrado." in mobile_js

    assert "C\u00f3digo PIX copiado." in caixa_js
    assert "estoque v\u00e1lido" in caixa_js
    assert "Adicional exclu\u00eddo definitivamente." in caixa_js
    assert "Produto exclu\u00eddo definitivamente." in caixa_js
    assert "C\u00f3digo exclu\u00eddo." in caixa_js
    assert "Comanda exclu\u00edda (" in caixa_js

    assert "Hist\u00f3rico de cupons atualizado." in comandas_js
    assert "Comanda inv\u00e1lida para reimpress\u00e3o." in comandas_js


def test_upload_imagem_rejeita_content_type_invalido(client: TestClient):
    response = client.post(
        "/produtos/upload-imagem",
        files={"file": ("nao-imagem.txt", b"abc", "text/plain")},
    )
    assert response.status_code == 400
    assert "apenas imagens" in response.json()["detail"].lower()


def test_upload_imagem_rejeita_arquivo_vazio(client: TestClient):
    response = client.post(
        "/produtos/upload-imagem",
        files={"file": ("vazio.png", b"", "image/png")},
    )
    assert response.status_code == 400
    assert "arquivo vazio" in response.json()["detail"].lower()


def test_upload_imagem_rejeita_acima_do_limite(client: TestClient):
    payload = b"x" * (5 * 1024 * 1024 + 1)
    response = client.post(
        "/produtos/upload-imagem",
        files={"file": ("grande.png", payload, "image/png")},
    )
    assert response.status_code == 400
    assert "5mb" in response.json()["detail"].lower()


def test_upload_imagem_define_extensao_por_content_type(client: TestClient):
    response = client.post(
        "/produtos/upload-imagem",
        files={"file": ("sem-extensao", b"png-data", "image/png")},
    )
    assert response.status_code == 200
    assert response.json()["imagem_url"].endswith(".png")


def test_rejeita_nomes_apenas_com_espacos(client: TestClient):
    produto = client.post(
        "/produtos",
        json={
            "nome": "   ",
            "preco": "2.00",
            "ativo": True,
            "estoque_atual": 1,
        },
    )
    assert produto.status_code == 422

    adicional = client.post(
        "/adicionais",
        json={
            "nome": "   ",
            "preco": "1.00",
            "ativo": True,
        },
    )
    assert adicional.status_code == 422


def test_erp_config_mobile_listas_customizaveis(client: TestClient):
    patch_resp = client.patch(
        "/config/erp",
        json={
            "mobile_obs_rapidas": ["Sem pimenta", "Sem pimenta", "  Pouco sal  "],
            "mobile_mais_pedidos": ["1", "Cafe", "Cafe"],
        },
    )
    assert patch_resp.status_code == 200
    payload = patch_resp.json()
    assert payload["mobile_obs_rapidas"] == ["Sem pimenta", "Pouco sal"]
    assert payload["mobile_mais_pedidos"] == ["1", "Cafe"]


def test_erp_config_mobile_motivos_reabertura_customizaveis(client: TestClient):
    patch_resp = client.patch(
        "/config/erp",
        json={
            "mobile_motivos_reabertura_entregue": [
                "Erro no status",
                "Erro no status",
                "  Cliente pediu ajuste  ",
            ],
        },
    )
    assert patch_resp.status_code == 200
    payload = patch_resp.json()
    assert payload["mobile_motivos_reabertura_entregue"] == [
        "Erro no status",
        "Cliente pediu ajuste",
    ]


def test_erp_config_mobile_mais_pedidos_aceita_formato_vinculado(client: TestClient):
    patch_resp = client.patch(
        "/config/erp",
        json={
            "mobile_mais_pedidos": [
                "12|Cafe da Vovo",
                "12|Cafe da Vovo",
                "34|Pao Frances",
            ],
        },
    )
    assert patch_resp.status_code == 200
    payload = patch_resp.json()
    assert payload["mobile_mais_pedidos"] == ["12|Cafe da Vovo", "34|Pao Frances"]


def test_cupom_cozinha_mostra_pedido_comanda_e_flag_alteracao(client: TestClient):
    _create_codigo(client, "C-777")
    produto = _create_produto(client)
    comanda = _abrir_comanda(client, "C-777")

    add_item = client.post(
        f"/comandas/{comanda['id']}/itens",
        json={
            "produto_id": produto["id"],
            "quantidade": 1,
            "observacoes": "Sem sal",
            "adicionais": [],
        },
    )
    assert add_item.status_code == 200

    cupom = client.get(f"/comandas/{comanda['id']}/cupom?cozinha=true&alteracao=true")
    assert cupom.status_code == 200
    assert f"Pedido Comanda: {comanda['comanda_codigo']}" in cupom.text
    assert "ALTERA\u00c7\u00c3O" in cupom.text
    assert "Lista da Cozinha" not in cupom.text
    assert "Valor final do item" not in cupom.text

