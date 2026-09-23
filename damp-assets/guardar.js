/* ===========================================================================
   Guardar arquivos grandes no proprio navegador (IndexedDB).
   ===========================================================================
   ⚠ ONDE O ARQUIVO FICA, E ISTO PRECISA ESTAR CLARO PARA QUEM USA:
     o site do Recati e ESTATICO (GitHub Pages). Nao existe servidor para
     receber upload. Entao o video/foto que voce adiciona fica GUARDADO NESTE
     NAVEGADOR, neste aparelho -- e so aqui. Ele sobrevive a fechar a aba e a
     desligar o celular, mas NAO aparece para quem abrir o site em outro
     aparelho.

     Para um arquivo aparecer para todo mundo, ele precisa entrar no
     repositorio do site. As paginas ja procuram por esse arquivo fixo antes
     de olhar aqui -- ver "ORDEM DE PREFERENCIA" na pagina do video.

   ⚠ POR QUE INDEXEDDB E NAO localStorage: o localStorage guarda TEXTO e
     estoura por volta de 5 MB. Um video de celular passa disso na primeira
     tentativa, e o erro que ele da (QuotaExceededError) acontece DEPOIS de a
     pessoa ter escolhido o arquivo e esperado -- o pior momento possivel.
     IndexedDB guarda o Blob direto e aguenta o tamanho.
   =========================================================================== */
(function (raiz) {
  'use strict';

  var BANCO = 'damp', LOJA = 'arquivos', VERSAO = 1;

  function abrir() {
    return new Promise(function (ok, erro) {
      // ⚠ Em aba anonima, com dados de site bloqueados, ou dentro de alguns
      //   navegadores embutidos, o proprio indexedDB pode nao existir ou
      //   lancar no open(). Quem chama TEM de continuar funcionando sem isto.
      var req;
      try {
        if (!raiz.indexedDB) throw new Error('sem indexedDB');
        req = raiz.indexedDB.open(BANCO, VERSAO);
      } catch (e) { erro(e); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(LOJA)) db.createObjectStore(LOJA);
      };
      req.onsuccess = function () { ok(req.result); };
      req.onerror   = function () { erro(req.error || new Error('open falhou')); };
      req.onblocked = function () { erro(new Error('banco bloqueado por outra aba')); };
    });
  }

  function transacao(modo, feito) {
    return abrir().then(function (db) {
      return new Promise(function (ok, erro) {
        var t = db.transaction(LOJA, modo);
        var r = feito(t.objectStore(LOJA));
        t.oncomplete = function () { db.close(); ok(r && r.result); };
        t.onerror    = function () { db.close(); erro(t.error); };
        t.onabort    = function () { db.close(); erro(t.error || new Error('abortou')); };
      });
    });
  }

  raiz.Guardar = {
    /** Devolve o Blob guardado sob `chave`, ou null. Nunca rejeita: sem
     *  armazenamento, "nao ha nada guardado" e a resposta certa. */
    ler: function (chave) {
      return transacao('readonly', function (loja) { return loja.get(chave); })
        .catch(function () { return null; })
        .then(function (v) { return v || null; });
    },
    /** Guarda o Blob. Rejeita com um motivo legivel -- quem chama mostra. */
    por: function (chave, blob) {
      return transacao('readwrite', function (loja) { loja.put(blob, chave); })
        .then(function () { return true; });
    },
    tirar: function (chave) {
      return transacao('readwrite', function (loja) { loja.delete(chave); })
        .then(function () { return true; })
        .catch(function () { return false; });
    }
  };

  /** Tamanho legivel. 0 vira "0 B" e nao "" -- um vazio na tela parece erro. */
  raiz.tamanhoLegivel = function (n) {
    if (!(n >= 0)) return '?';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  };
})(window);
