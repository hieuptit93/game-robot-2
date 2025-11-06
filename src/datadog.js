import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

// Khởi tạo Datadog RUM
datadogRum.init({
  applicationId: process.env.REACT_APP_DATADOG_APPLICATION_ID,
  clientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN,
  site: process.env.REACT_APP_DATADOG_SITE,
  service: process.env.REACT_APP_DATADOG_SERVICE,
  env: process.env.NODE_ENV || 'development',
  // Specify a version number to identify the deployed version of your application in Datadog
  version: process.env.REACT_APP_DATADOG_VERSION,
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