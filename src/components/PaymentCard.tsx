import { Card } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { PaymentStatus } from "./financials/payment-card/PaymentStatus";
import { PaymentDueDate } from "./financials/payment-card/PaymentDueDate";
import { Check, Clock, AlertOctagon } from "lucide-react";

interface PaymentCardProps {
  annualPaymentStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionAmount?: number;
  annualPaymentDueDate?: string;
  emergencyCollectionDueDate?: string;
  lastAnnualPaymentDate?: string;
  lastEmergencyPaymentDate?: string;
  lastAnnualPaymentAmount?: number;
  lastEmergencyPaymentAmount?: number;
}

const PaymentCard = ({
  annualPaymentStatus = 'pending',
  emergencyCollectionStatus = 'pending',
  emergencyCollectionAmount = 0,
  annualPaymentDueDate,
  emergencyCollectionDueDate,
  lastAnnualPaymentDate,
  lastEmergencyPaymentDate,
  lastAnnualPaymentAmount,
  lastEmergencyPaymentAmount
}: PaymentCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'January 1st, 2025';
    try {
      return format(new Date(dateString), 'MMMM do, yyyy');
    } catch (e) {
      return 'January 1st, 2025';
    }
  };

  const getPaymentStatusInfo = (dueDate?: string) => {
    if (!dueDate) return { message: "Due date not set", isOverdue: false };
    
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const daysUntilDue = differenceInDays(dueDateObj, today);
    const daysOverdue = differenceInDays(today, dueDateObj);
    
    if (daysUntilDue > 0) {
      return { 
        message: `Due in ${daysUntilDue} days`, 
        isOverdue: false 
      };
    } else if (daysOverdue <= 28) {
      return { 
        message: `Payment overdue by ${daysOverdue} days`, 
        isOverdue: true,
        isGracePeriod: true
      };
    } else {
      return { 
        message: `Payment critically overdue - ${daysOverdue - 28} days past grace period`, 
        isOverdue: true,
        isGracePeriod: false
      };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-emerald-400" />;
      case 'pending':
      case 'due':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'overdue':
        return <AlertOctagon className="h-5 w-5 text-rose-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const renderPendingMessage = (paymentType: string) => {
    return (
      <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-yellow-400 text-sm font-medium">
          Thank you for your {paymentType} payment submission
        </p>
        <p className="text-dashboard-text/70 text-xs mt-1">
          Your payment is being reviewed and will be processed shortly
        </p>
      </div>
    );
  };

  return (
    <Card className="p-8 bg-dashboard-dark border border-dashboard-cardBorder">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Annual Payment Section */}
        <div className="p-6 glass-card rounded-xl border border-dashboard-highlight/20 hover:border-dashboard-highlight/40 transition-all duration-300 shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-8">Annual Payment</h3>
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-dashboard-accent1">£40</p>
                  <p className="text-sm text-dashboard-text/70">Annual membership fee</p>
                </div>
                <PaymentDueDate 
                  dueDate={annualPaymentDueDate} 
                  color="text-dashboard-accent1"
                  statusInfo={getPaymentStatusInfo(annualPaymentDueDate)}
                />
              </div>
              <div className="flex flex-col items-end space-y-4">
                <PaymentStatus 
                  status={annualPaymentStatus} 
                  icon={getStatusIcon(annualPaymentStatus)}
                />
                {getPaymentStatusInfo(annualPaymentDueDate).isOverdue && (
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    getPaymentStatusInfo(annualPaymentDueDate).isGracePeriod 
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {getPaymentStatusInfo(annualPaymentDueDate).message}
                  </span>
                )}
              </div>
            </div>
            {annualPaymentStatus === 'pending' && renderPendingMessage('annual')}
            {lastAnnualPaymentDate && (
              <div className="pt-4 mt-4 border-t border-dashboard-cardBorder/30">
                <p className="text-sm font-medium mb-2 text-dashboard-text/90">
                  Last payment details
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-dashboard-text/80">
                    Date: {formatDate(lastAnnualPaymentDate)}
                  </p>
                  {lastAnnualPaymentAmount && (
                    <p className="text-sm text-emerald-400 font-medium">
                      Amount paid: £{lastAnnualPaymentAmount}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Collection Section */}
        <div className="p-6 glass-card rounded-xl border border-dashboard-highlight/20 hover:border-dashboard-highlight/40 transition-all duration-300 shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-8">Emergency Collection</h3>
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-dashboard-accent1">
                    £{emergencyCollectionAmount}
                  </p>
                  <p className="text-sm text-dashboard-text/70">One-time payment</p>
                </div>
                <PaymentDueDate 
                  dueDate={emergencyCollectionDueDate}
                  color="text-dashboard-accent1"
                  statusInfo={getPaymentStatusInfo(emergencyCollectionDueDate)}
                />
              </div>
              <div className="flex flex-col items-end space-y-4">
                <PaymentStatus 
                  status={emergencyCollectionStatus} 
                  icon={getStatusIcon(emergencyCollectionStatus)}
                />
                {getPaymentStatusInfo(emergencyCollectionDueDate).isOverdue && (
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    getPaymentStatusInfo(emergencyCollectionDueDate).isGracePeriod 
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {getPaymentStatusInfo(emergencyCollectionDueDate).message}
                  </span>
                )}
              </div>
            </div>
            {emergencyCollectionStatus === 'pending' && renderPendingMessage('emergency')}
            {lastEmergencyPaymentDate && (
              <div className="pt-4 mt-4 border-t border-dashboard-cardBorder/30">
                <p className="text-sm font-medium mb-2 text-dashboard-text/90">
                  Last payment details
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-dashboard-text/80">
                    Date: {formatDate(lastEmergencyPaymentDate)}
                  </p>
                  {lastEmergencyPaymentAmount && (
                    <p className="text-sm text-emerald-400 font-medium">
                      Amount paid: £{lastEmergencyPaymentAmount}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentCard;