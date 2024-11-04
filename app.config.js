export default {
    expo: {
        name: "passwordify",
        slug: "your-app-name",
        owner: "harshit345686",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.harshit.passwordify",
            googleServicesFile: "./google-services.json"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            "expo-secure-store",
            [
                "@react-native-firebase/app",
                {
                    androidPackage: "com.harshit.passwordify"
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            stytchProjectId: process.env.STYTCH_PROJECT_ID,
            stytchSecret: process.env.STYTCH_SECRET,
            eas: {
                projectId: "322c36a9-ad1a-4a7f-94ac-38557e33ee8e"
            }
        }
    }
};