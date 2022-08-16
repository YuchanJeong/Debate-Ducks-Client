import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import {
  getUser,
  patchUserNickname,
  patchUserImage,
  patchUserPassword,
  login,
} from "../../api/users";
import { queryStr } from ".";

import { User, UserInfo } from "../../types";

export const useGetUser = (options?: UseQueryOptions<User, AxiosError>) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  const query = useQuery<User, AxiosError>(
    [queryStr.users],
    () => getUser(token),
    {
      enabled: !!token,
      ...options,
    },
  );
  return query;
};

export const useLogin = (
  options?: UseMutationOptions<
    string,
    AxiosError,
    Pick<UserInfo, "email" | "password">
  >,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((userInfo) => login(userInfo), {
    ...options,
    onSuccess: (data) => {
      localStorage.setItem("debate-ducks-token", data);

      queryClient.invalidateQueries([queryStr.users]);
      queryClient.invalidateQueries([queryStr.hearts]);
      queryClient.invalidateQueries([queryStr.votes]);

      const storage = globalThis?.sessionStorage;
      const link =
        storage.getItem("prevPath") === "/signin" ||
        storage.getItem("prevPath") === "/signup"
          ? "/"
          : storage.getItem("prevPath") || "/";
      router.push(link);

      toast.success("로그인에 성공했습니다.");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

export const usePatchUserImage = (
  userId: string,
  formData: FormData | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation(() => patchUserImage(userId, formData), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.users]);
      toast.success("프로필 이미지가 수정되었습니다!");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

export const usePatchUserNickname = (userId: string, nickname: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => patchUserNickname(userId, nickname), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.users]);
      toast.success("이름이 변경되었습니다!");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

export const usePatchUserPassword = (
  userId: string,
  prevPassword: string,
  nextPassword: string,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => patchUserPassword(userId, prevPassword, nextPassword),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryStr.users]);
        toast.success("비밀번호가 변경되었습니다!");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(
          `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
        );
      },
    },
  );
};
