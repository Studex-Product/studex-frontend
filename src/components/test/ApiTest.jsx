import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const { 
    register, 
    verifyAccount, 
    verifyEmail, 
    isRegistering, 
    isVerifyingAccount, 
    isVerifyingEmail 
  } = useAuth();

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, time: new Date().toLocaleTimeString() }]);
  };

  const testRegistration = () => {
    addResult('Registration', 'testing', 'Starting registration test...');
    register.mutate({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123"
    });
  };

  const testVerifyAccount = () => {
    addResult('Account Verification', 'testing', 'Testing account verification...');
    verifyAccount.mutate({
      email: "test@example.com",
      verificationCode: "123456"
    });
  };

  const testVerifyEmail = () => {
    addResult('Email Verification', 'testing', 'Testing email verification...');
    verifyEmail.mutate({
      email: "test@example.com"
    });
  };

  // Listen for API results
  React.useEffect(() => {
    if (register.isSuccess) {
      addResult('Registration', 'success', 'Registration successful!');
    }
    if (register.isError) {
      addResult('Registration', 'error', `Registration failed: ${register.error.message}`);
    }
  }, [register.isSuccess, register.isError]);

  React.useEffect(() => {
    if (verifyAccount.isSuccess) {
      addResult('Account Verification', 'success', 'Account verification successful!');
    }
    if (verifyAccount.isError) {
      addResult('Account Verification', 'error', `Verification failed: ${verifyAccount.error.message}`);
    }
  }, [verifyAccount.isSuccess, verifyAccount.isError]);

  React.useEffect(() => {
    if (verifyEmail.isSuccess) {
      addResult('Email Verification', 'success', 'Email verification successful!');
    }
    if (verifyEmail.isError) {
      addResult('Email Verification', 'error', `Email verification failed: ${verifyEmail.error.message}`);
    }
  }, [verifyEmail.isSuccess, verifyEmail.isError]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mock API Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testRegistration}
          disabled={isRegistering}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRegistering ? 'Testing...' : 'Test Registration'}
        </button>
        
        <button
          onClick={testVerifyAccount}
          disabled={isVerifyingAccount}
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isVerifyingAccount ? 'Testing...' : 'Test Account Verification'}
        </button>
        
        <button
          onClick={testVerifyEmail}
          disabled={isVerifyingEmail}
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isVerifyingEmail ? 'Testing...' : 'Test Email Verification'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Test Results:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded border-l-4 ${
                result.status === 'success' ? 'bg-green-50 border-green-500' :
                result.status === 'error' ? 'bg-red-50 border-red-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong>{result.test}</strong> - {result.status}
                  <div className="text-sm text-gray-600">{result.message}</div>
                </div>
                <span className="text-xs text-gray-500">{result.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Environment Check:</h3>
        <p className="text-sm text-yellow-700">
          Base URL: {import.meta.env.VITE_STUDEX_BASE_URL || 'Not configured'}
        </p>
        <p className="text-sm text-yellow-700">
          Status: {import.meta.env.VITE_STUDEX_BASE_URL ? '✅ Configured' : '❌ Missing'}
        </p>
      </div>
    </div>
  );
};

export default ApiTest;