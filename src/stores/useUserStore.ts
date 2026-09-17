import { get, setAuthorizationHeader } from "@/services/api";
import { UserType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface UserStore {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserType) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (data: { user: UserType; token: string }) => Promise<void>;
  authenticatedControl: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  authenticatedControl: async () => {
    set({ isLoading: true });
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
    } else {
      setAuthorizationHeader(token);
      const response = await get("/users/me");

      if (response.status) {
        if (response.data.type === "outside") {
          const responseFollow = await get(
            `/follows?filters[user][id][$eq]=${response.data.id}&sort=createdAt:desc&pagination[pageSize]=1`,
          );

          const user = {
            ...response.data,
            follows: responseFollow?.data?.data?.[0] || {
              cource: "1",
              exercise: "1",
              level: "1",
            },
          };

          set({ user, isAuthenticated: true, token });
          AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          const responseFollow = await get(`/follows`);

          set({ user: response.data, isAuthenticated: true, token });
          AsyncStorage.setItem("user", JSON.stringify(response.data));
        }

        AsyncStorage.setItem("token", token);
      } else {
        set({ isAuthenticated: false, user: null, token: null });
      }
    }
    set({ isLoading: false });
  },
  login: async (data: any) => {
    set({ user: data.user, isAuthenticated: true, token: data.token });
    AsyncStorage.setItem("user", JSON.stringify(data.user));
    AsyncStorage.setItem("token", data.token);
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("token");
  },
}));
