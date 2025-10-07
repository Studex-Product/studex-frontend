import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '@/api/adminService';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { toast } from 'sonner';
import Loader from '@/assets/Loader.svg';
import {
  ArrowLeft,
  Check,
  X,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  School,
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  Shield
} from 'lucide-react';

const VerificationDetail = () => {
  const { verificationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch verification details
  const { data: verification, isLoading, error } = useQuery({
    queryKey: ['verification', verificationId],
    queryFn: () => adminService.getVerificationById(verificationId),
    retry: false
  });

  // Review verification mutation
  const reviewMutation = useMutation({
    mutationFn: ({ status, review_note }) =>
      adminService.reviewVerification(verificationId, status, review_note),
    onSuccess: (data, variables) => {
      const actionText = variables.status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Verification ${actionText} successfully!`);
      queryClient.invalidateQueries(['verification', verificationId]);
      queryClient.invalidateQueries(['admin-verifications']);
      queryClient.invalidateQueries(['verification-stats']);

      if (variables.status === 'rejected') {
        setShowRejectModal(false);
        setRejectReason('');
      }

      // Navigate back to verifications list after a delay
      setTimeout(() => {
        navigate('/admin/verifications');
      }, 2000);
    },
    onError: (error) => {
      toast.error(`Failed to process verification: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleApprove = () => {
    if (window.confirm('Are you sure you want to approve this verification?')) {
      reviewMutation.mutate({
        status: 'approved',
        review_note: '' // Optional for approved status
      });
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    reviewMutation.mutate({
      status: 'rejected',
      review_note: rejectReason // Required for rejected status
    });
  };

  const handleBackToVerifications = () => {
    navigate('/admin/verifications');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: Check },
      rejected: { color: 'bg-red-100 text-red-800', icon: X }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <Icon size={16} className="mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <img
                              src={Loader}
                              alt="Loading..."
                              className="w-12 h-12 mx-auto mb-4"
              />
              <p className="mt-2 text-gray-600">Loading verification details...</p>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Verification</h3>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={handleBackToVerifications}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Back to Verifications
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToVerifications}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verification Details</h1>
              <p className="text-gray-600">Review student verification request</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {verification?.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  disabled={reviewMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {reviewMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={reviewMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {reviewMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Verification Status</h2>
                <p className="text-gray-600">Current status of this verification request</p>
              </div>
            </div>
            {getStatusBadge(verification?.status)}
          </div>
          {verification?.review_note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Review Note:</p>
              <p className="text-sm text-gray-600 mt-1">{verification.review_note}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {verification?.user_name?.split(' ')[0]?.[0]}{verification?.user_name?.split(' ')[1]?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{verification?.user_name}</p>
                  <p className="text-sm text-gray-600">Student ID: {verification?.user_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{verification?.user_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <School className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Campus</p>
                    <p className="font-medium">{verification?.campus_name}</p>
                  </div>
                </div>

                {verification?.school_id && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">School ID</p>
                      <p className="font-medium">{verification.school_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Verification Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Document Type</p>
                <p className="font-medium text-gray-900">{verification?.document_type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{formatDate(verification?.submitted_at)}</p>
                </div>
              </div>

              {verification?.file_url && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Submitted Document</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open(verification.file_url, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      View Document
                    </button>
                    <span className="text-sm text-gray-500">Click to open in new tab</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Preview */}
        {verification?.file_url && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={verification.file_url}
                className="w-full h-96"
                title="Verification Document"
              />
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Reject Verification
                </h2>
                <p className="text-gray-600">
                  Please provide a reason for rejecting this verification request.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter the reason for rejection..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={reviewMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim() || reviewMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Rejecting...
                    </div>
                  ) : (
                    'Reject Verification'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default VerificationDetail;