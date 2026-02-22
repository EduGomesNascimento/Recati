# PadariaERP Mobile (APK)

Aplicativo Android (WebView) para operar a tela mobile do PadariaERP (`/mobile`) com conectividade ao backend.

## Arquitetura de acesso ao banco

- O APK **não acessa o banco SQLite diretamente**.
- O acesso é feito somente pela API do servidor FastAPI.
- Fluxo correto: `APK -> HTTP/HTTPS -> API -> SQLite`.

## Recursos incluídos

- URL do servidor configurável no próprio app (botão `Servidor`).
- URL padrão automática no build (usa IP local da máquina do caixa para celular físico).
- Verificação de saúde do backend (`/health`) antes de abrir a tela.
- Tela de erro com `Tentar de novo` e `Configurar`.
- Atualização por gesto (`pull to refresh`).
- Bloqueio de rotas administrativas no app (`/caixa`, `/docs`, `/redoc`, `/openapi.json`).
- Redirecionamento seguro para links externos fora do backend.

## Como usar no Android Studio

1. Abra a pasta `android_studio_app` no Android Studio.
2. Aguarde o sync do Gradle.
3. Rode o backend Python (`run_app.py`) na sua máquina.
4. Abra o app e configure o servidor no botão `Servidor`.

## Endereços recomendados

- Emulador Android: `http://10.0.2.2:8000`
- Celular físico na mesma rede: `http://IP_DA_MAQUINA:8000`
  Exemplo: `http://192.168.0.20:8000`

## Gerar APK

- `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`
- Opcional via terminal:
  - `./gradlew assembleDebug`
  - Para forçar URL padrão customizada no APK:
    - `PADARIA_BACKEND_URL=http://192.168.0.20:8000 ./gradlew assembleDebug`

## Observações de produção

- Preferir HTTPS em produção.
- Se publicar externamente, colocar backend atrás de domínio/TLS.
- O app já possui `INTERNET` e `ACCESS_NETWORK_STATE` para conectividade.
