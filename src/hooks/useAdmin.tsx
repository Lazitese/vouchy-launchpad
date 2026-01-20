import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useAdmin = () => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (authLoading) return;
            if (!user) {
                setIsAdmin(false);
                setChecking(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)
                    .eq('role', 'admin')
                    .maybeSingle();

                if (data && !error) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            } finally {
                setChecking(false);
            }
        };

        checkAdmin();
    }, [user, authLoading]);

    return { isAdmin, loading: checking || authLoading };
};
