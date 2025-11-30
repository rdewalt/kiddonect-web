import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_9TsqNrXwz',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '3u46i0chjf5ehc0eip28v0ejkv',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
