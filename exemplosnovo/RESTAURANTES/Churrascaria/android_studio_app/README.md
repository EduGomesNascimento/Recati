# ChurrascariaERP Mobile no Android Studio

Projeto Android (WebView) para empacotar a tela mobile do ChurrascariaERP (`/mobile`) como APK.

## Como usar

1. Abra `android_studio_app` no Android Studio.
2. Aguarde sync do Gradle.
3. Garanta o backend Python rodando em `http://10.0.2.2:8100` para emulador:
   - Emulador Android: `10.0.2.2` aponta para o host.
   - Dispositivo fÃ­sico: troque a URL no `MainActivity.kt` para o IP da mÃ¡quina.
4. Rode em debug (`Run 'app'`).
5. Gere APK:
   - `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.

## URL carregada

- Arquivo: `app/src/main/java/com/churrascariaerp/mobile/MainActivity.kt`
- URL padrÃ£o: `http://10.0.2.2:8100/mobile`

## ObservaÃ§Ãµes

- O app estÃ¡ preparado para trÃ¡fego HTTP local (`usesCleartextTraffic=true`).
- Para produÃ§Ã£o, use HTTPS e ajuste o `network_security_config.xml`.

