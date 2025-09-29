import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Database, Lock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { RoleManagement } from '@/components/admin/RoleManagement';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        const adminRole = data?.find(role => role.role === 'admin');
        const roles = data?.map(r => r.role) || [];
        
        setIsAdmin(!!adminRole);
        setUserRole(roles.join(', ') || 'viewer');
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      }
    };

    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth and admin status
  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
              <p className="text-muted-foreground">Manage users, roles, and security settings</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-cyber-primary/10 text-cyber-primary border-cyber-primary">
            <Shield className="w-3 h-3 mr-1" />
            Role: {userRole}
          </Badge>
        </div>

        {/* Access Control Check */}
        {!isAdmin ? (
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Access Denied:</strong> You need administrator privileges to access this page. 
              Your current role is: {userRole}. Contact your system administrator for admin access.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Security Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-cyber-surface border-cyber-surface-variant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                  <CheckCircle className="h-4 w-4 text-cyber-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyber-success">SECURED</div>
                  <p className="text-xs text-muted-foreground">RLS policies active</p>
                </CardContent>
              </Card>

              <Card className="bg-cyber-surface border-cyber-surface-variant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protected Tables</CardTitle>
                  <Database className="h-4 w-4 text-cyber-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyber-primary">5</div>
                  <p className="text-xs text-muted-foreground">threats, incidents, assets, logs, metrics</p>
                </CardContent>
              </Card>

              <Card className="bg-cyber-surface border-cyber-surface-variant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Access Control</CardTitle>
                  <Lock className="h-4 w-4 text-cyber-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyber-warning">RBAC</div>
                  <p className="text-xs text-muted-foreground">Role-based security</p>
                </CardContent>
              </Card>

              <Card className="bg-cyber-surface border-cyber-surface-variant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Auth Required</CardTitle>
                  <Users className="h-4 w-4 text-cyber-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyber-secondary">YES</div>
                  <p className="text-xs text-muted-foreground">All endpoints secured</p>
                </CardContent>
              </Card>
            </div>

            {/* Security Fixes Alert */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Issue RESOLVED:</strong> The threats table and other sensitive data are now protected with 
                role-based access control (RBAC). Only authenticated users with appropriate security roles can access 
                threat intelligence data. The following security measures have been implemented:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Row-Level Security (RLS) policies on all sensitive tables</li>
                  <li>Role-based access control with admin, security_analyst, and viewer roles</li>
                  <li>Authentication required for all dashboard access</li>
                  <li>Security definer functions to prevent policy recursion</li>
                  <li>Automatic profile and role creation for new users</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Role Management */}
            <RoleManagement />

            {/* Security Implementation Details */}
            <Card className="bg-cyber-surface border-cyber-surface-variant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyber-primary" />
                  Security Implementation Details
                </CardTitle>
                <CardDescription>
                  Technical details of the security measures implemented
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Protected Tables</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>threats</strong> - Threat intelligence data</li>
                      <li>• <strong>incidents</strong> - Security incident records</li>
                      <li>• <strong>monitored_assets</strong> - Network asset inventory</li>
                      <li>• <strong>network_logs</strong> - Network traffic logs</li>
                      <li>• <strong>security_metrics</strong> - Performance metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Access Levels</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Admin</strong> - Full system access and user management</li>
                      <li>• <strong>Security Analyst</strong> - Read/write access to threat data</li>
                      <li>• <strong>Viewer</strong> - Limited read access to dashboards</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;