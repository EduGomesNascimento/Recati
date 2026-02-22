import java.net.Inet4Address
import java.net.NetworkInterface
import java.util.Collections

fun resolveDefaultBackendUrl(): String {
    val envUrl = System.getenv("PADARIA_BACKEND_URL")?.trim().orEmpty()
    if (envUrl.isNotEmpty()) {
        return envUrl
    }

    val envHost = System.getenv("PADARIA_BACKEND_HOST")?.trim().orEmpty()
    if (envHost.isNotEmpty()) {
        return "http://$envHost:8000"
    }

    val candidateIp = try {
        Collections.list(NetworkInterface.getNetworkInterfaces())
            .asSequence()
            .filter { it.isUp && !it.isLoopback && !it.isVirtual }
            .flatMap { Collections.list(it.inetAddresses).asSequence() }
            .filterIsInstance<Inet4Address>()
            .map { it.hostAddress.orEmpty() }
            .firstOrNull {
                it.startsWith("192.168.") ||
                    it.startsWith("10.") ||
                    it.matches(Regex("^172\\.(1[6-9]|2\\d|3[0-1])\\..+"))
            }
    } catch (_: Exception) {
        null
    }

    val host = candidateIp ?: "10.0.2.2"
    return "http://$host:8000"
}

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val emulatorBackendUrl = "http://10.0.2.2:8000"
val defaultBackendUrl = resolveDefaultBackendUrl()

android {
    namespace = "com.padariaerp.mobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.padariaerp.mobile"
        minSdk = 24
        targetSdk = 35
        versionCode = 2
        versionName = "1.0.1"
        buildConfigField("String", "DEFAULT_BACKEND_URL", "\"$defaultBackendUrl\"")
        buildConfigField("String", "EMULATOR_BACKEND_URL", "\"$emulatorBackendUrl\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("com.google.android.material:material:1.12.0")
}
