import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

// Khởi tạo Datadog RUM
datadogRum.init({
  applicationId: '00dd11cc-a443-46ae-a7c7-6cfb93bf621c',
  clientToken: 'pub4b4b85bead100f373d44f10a9ca7b7cb',
  site: 'us5.datadoghq.com',
  service: 'space-pronunciation-game',
  env: 'prod',
  // Specify a version number to identify the deployed version of your application in Datadog
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  defaultPrivacyLevel: 'mask-user-input',
  plugins: [
    reactPlugin({ 
      router: false // Set to true if you use React Router
    })
  ],
});

// Function to set user information
export const setDatadogUser = (userId, additionalInfo = {}) => {
  if (userId) {
    datadogRum.setUser({
      id: userId,
      ...additionalInfo
    });
    console.log('Datadog user set:', { id: userId, ...additionalInfo });
  }
};

export default datadogRum;