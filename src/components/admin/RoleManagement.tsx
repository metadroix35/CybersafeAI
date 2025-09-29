import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'security_analyst' | 'viewer';
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  full_name?: string;
}

export const RoleManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      setUserRoles(rolesData || []);
      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to load user roles and profiles. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Role removed",
        description: "Successfully removed user role.",
      });

      fetchData();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        variant: "destructive",
        title: "Error removing role",
        description: "Failed to remove role. Please try again.",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-cyber-danger/10 text-cyber-danger border-cyber-danger';
      case 'security_analyst':
        return 'bg-cyber-warning/10 text-cyber-warning border-cyber-warning';
      case 'viewer':
        return 'bg-cyber-success/10 text-cyber-success border-cyber-success';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const getUserProfile = (userId: string) => {
    return profiles.find(p => p.id === userId);
  };

  if (loading) {
    return (
      <Card className="bg-cyber-surface border-cyber-surface-variant">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Access Required:</strong> You need admin privileges to manage user roles. 
          Contact your system administrator if you need access to security data.
        </AlertDescription>
      </Alert>

      <Card className="bg-cyber-surface border-cyber-surface-variant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyber-primary" />
            User Role Management
          </CardTitle>
          <CardDescription>
            Manage user access levels and security roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Users & Roles</h3>
            {userRoles.length === 0 ? (
              <p className="text-muted-foreground">No users found.</p>
            ) : (
              <div className="space-y-3">
                {userRoles.map((userRole) => {
                  const profile = getUserProfile(userRole.user_id);
                  return (
                    <div
                      key={userRole.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface-variant border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">
                            {profile?.full_name || profile?.email || 'Unknown User'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {profile?.email || userRole.user_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getRoleColor(userRole.role)}
                        >
                          {userRole.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRole(userRole.id)}
                          className="text-cyber-danger hover:text-cyber-danger"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> To assign roles to users, they must first create an account through the sign-up process. 
                New users are automatically assigned the "viewer" role. Admins can then update their roles as needed.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};