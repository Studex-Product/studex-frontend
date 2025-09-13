import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const { 
    register, 
    verifyAccount, 
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    isRegistering, 
    isVerifyingAccount, 
    isVerifyingEmail,
    isLoggingIn,
    isSendingResetEmail, // Updated name
    isResettingPassword,
    user,
    isAuthenticated
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

  const testLogin = () => {
    addResult('Login', 'testing', 'Starting login test...');
    login.mutate({
      email: "test@example.com",
      password: "password123"
    });
  };

  const testForgotPassword = () => {
    addResult('Forgot Password', 'testing', 'Testing forgot password...');
    forgotPassword.mutate({
      email: "test@example.com"
    });
  };

  const testResetPassword = () => {
    addResult('Reset Password', 'testing', 'Testing reset password...');
    resetPassword.mutate({
      token: "mock-reset-token-12345",
      newPassword: "newPassword456!"
    });
  };

  const testLogout = () => {
    addResult('Logout', 'testing', 'Testing logout...');
    logout();
  };

  // Listen for API results
  React.useEffect(() => {
    if (register.isSuccess) addResult('Registration', 'success', 'Registration successful!');
    if (register.isError) addResult('Registration', 'error', `Registration failed: ${register.error.message}`);
  }, [register.isSuccess, register.isError]);

  React.useEffect(() => {
    if (verifyAccount.isSuccess) addResult('Account Verification', 'success', 'Account verification successful!');
    if (verifyAccount.isError) addResult('Account Verification', 'error', `Verification failed: ${verifyAccount.error.message}`);
  }, [verifyAccount.isSuccess, verifyAccount.isError]);

  React.useEffect(() => {
    if (verifyEmail.isSuccess) addResult('Email Verification', 'success', 'Email verification successful!');
    if (verifyEmail.isError) addResult('Email Verification', 'error', `Email verification failed: ${verifyEmail.error.message}`);
  }, [verifyEmail.isSuccess, verifyEmail.isError]);

  React.useEffect(() => {
    if (login.isSuccess) addResult('Login', 'success', 'Login successful!');
    if (login.isError) addResult('Login', 'error', `Login failed: ${login.error.message}`);
  }, [login.isSuccess, login.isError]);

  React.useEffect(() => {
    if (forgotPassword.isSuccess) addResult('Forgot Password', 'success', 'Forgot password request successful!');
    if (forgotPassword.isError) addResult('Forgot Password', 'error', `Request failed: ${forgotPassword.error.message}`);
  }, [forgotPassword.isSuccess, forgotPassword.isError]);

  React.useEffect(() => {
    if (resetPassword.isSuccess) addResult('Reset Password', 'success', 'Password reset successful!');
    if (resetPassword.isError) addResult('Reset Password', 'error', `Reset failed: ${resetPassword.error.message}`);
  }, [resetPassword.isSuccess, resetPassword.isError]);


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mock API Test</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Authentication Status:</h3>
        <p className="text-sm text-blue-700">Status: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}</p>
        {user && <p className="text-sm text-blue-700">User: {user.fullName} ({user.email})</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button onClick={testRegistration} disabled={isRegistering} className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">{isRegistering ? 'Testing...' : 'Test Registration'}</button>
        <button onClick={testVerifyAccount} disabled={isVerifyingAccount} className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 disabled:opacity-50">{isVerifyingAccount ? 'Testing...' : 'Test Account Verification'}</button>
        <button onClick={testVerifyEmail} disabled={isVerifyingEmail} className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 disabled:opacity-50">{isVerifyingEmail ? 'Testing...' : 'Test Email Verification'}</button>
        <button onClick={testLogin} disabled={isLoggingIn} className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 disabled:opacity-50">{isLoggingIn ? 'Testing...' : 'Test Login'}</button>
        <button onClick={testForgotPassword} disabled={isSendingResetEmail} className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSendingResetEmail ? 'Testing...' : 'Test Forgot Password'}</button>
        <button onClick={testResetPassword} disabled={isResettingPassword} className="bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 disabled:opacity-50">{isResettingPassword ? 'Testing...' : 'Test Reset Password'}</button>
        <button onClick={testLogout} disabled={!isAuthenticated} className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 disabled:opacity-50">Test Logout</button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Test Results:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? <p className="text-gray-500 italic">No tests run yet.</p> : testResults.map((result, index) => (
            <div key={index} className={`p-3 rounded border-l-4 ${result.status === 'success' ? 'bg-green-50 border-green-500' : result.status === 'error' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
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
        {testResults.length > 0 && <button onClick={() => setTestResults([])} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear Results</button>}
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

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Test Credentials:</h3>
        <div className="text-sm text-gray-700">
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
          <p>Verification Code: 123456</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;