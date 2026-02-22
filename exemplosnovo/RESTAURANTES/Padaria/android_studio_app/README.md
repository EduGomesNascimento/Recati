# PadariaERP Mobile no Android Studio

Projeto Android (WebView) para empacotar a tela mobile do PadariaERP (`/mobile`) como APK.

## Como usar

1. Abra `android_studio_app` no Android Studio.
2. Aguarde sync do Gradle.
3. Garanta o backend Python rodando em `http://10.0.2.2:8000` para emulador:
   - Emulador Android: `10.0.2.2` aponta para o host.
   - Dispositivo físico: troque a URL no `MainActivity.kt` para o IP da máquina.
4. Rode em debug (`Run 'app'`).
5. Gere APK:
   - `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.

## URL carregada

- Arquivo: `app/src/main/java/com/padariaerp/mobile/MainActivity.kt`
- URL padrão: `http://10.0.2.2:8000/mobile`

## Observações

- O app está preparado para tráfego HTTP local (`usesCleartextTraffic=true`).
- Para produção, use HTTPS e ajuste o `network_security_config.xml`.
