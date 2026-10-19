import {
  cdnURL,
  clearAuthorizationHeader,
  get as getApi,
  setAuthorizationHeader,
  setUnauthorizedHandler,
} from "@/services/api";
import { FollowType, ImageType, UserType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const toImageUrl = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${cdnURL}${url}`;
};

export const getUserImageUrl = (image?: UserType["image"]) => {
  if (!image) return undefined;
  if (typeof image === "string") return toImageUrl(image);
  return toImageUrl(image.url);
};

const defaultFollows: FollowType = {
  cource: "1",
  exercise: "1",
  level: "1",
};

export const mapUser = (data: any): UserType => {
  const rawImage = data?.image;
  const imageUrl = typeof rawImage === "string" ? rawImage : rawImage?.url;

  return {
    ...data,
    image: imageUrl
      ? ({
          id: typeof rawImage === "object" ? rawImage.id : undefined,
          url: toImageUrl(imageUrl) as string,
        } satisfies ImageType)
      : undefined,
    follows: Array.isArray(data?.follows)
      ? data.follows.at(-1) || defaultFollows
      : data?.follows || defaultFollows,
  };
};

interface UserStore {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserType) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (data: { user: UserType; token: string }) => Promise<void>;
  authenticatedControl: (isConnected: boolean) => Promise<void>;
  logout: () => void;
  setFollows: (follows: FollowType) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user });
    AsyncStorage.setItem("user", JSON.stringify(user));
  },

  setFollows: (follows) => {
    const user = get().user;
    set({ user: { ...(user as UserType), follows } });
    AsyncStorage.setItem(
      "user",
      JSON.stringify({ ...(user as UserType), follows }),
    );
  },

  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  authenticatedControl: async (isConnected: boolean) => {
    set({ isLoading: true });

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
    } else {
      setAuthorizationHeader(token);

      if (!isConnected) {
        const userData = await AsyncStorage.getItem("user");
        const user = userData ? mapUser(JSON.parse(userData)) : null;

        if (user) {
          set({ user, isAuthenticated: true, token });
        } else {
          set({ isAuthenticated: false, user: null, token: null });
        }
      } else {
        const response = await getApi("/users/me?populate=*");

        if (response.status) {
          const user = mapUser(response.data);

          set({ user, isAuthenticated: true, token });
          AsyncStorage.setItem("user", JSON.stringify(user));
          AsyncStorage.setItem("token", token);
        } else {
          set({ isAuthenticated: false, user: null, token: null });
        }
      }
    }
    set({ isLoading: false });
  },

  login: async (data: { user: UserType; token: string }) => {
    set({ user: data.user, isAuthenticated: true, token: data.token });

    AsyncStorage.setItem("token", data.token);

    const token = data.token;
    setAuthorizationHeader(token);

    const response = await getApi("/users/me?populate=*");

    if (response.status) {
      const user = mapUser(response.data);

      set({ user, isAuthenticated: true, token });
      AsyncStorage.setItem("user", JSON.stringify(user));
      AsyncStorage.setItem("token", token);
    } else {
      set({ isAuthenticated: false, user: null, token: null });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, token: null });
    clearAuthorizationHeader();
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("token");
  },
}));

setUnauthorizedHandler(() => {
  useUserStore.getState().logout();
});
