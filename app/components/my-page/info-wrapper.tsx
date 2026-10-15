import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import ContentTitle from "../board/content-title";
import InfoWrapperSkeleton from "./skeleton/info-wrapper-skeleton";

interface User {
  name: string | undefined;
  email: string | undefined;
}

export default function InfoWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User>({
    name: undefined,
    email: undefined,
  });

  useEffect(() => {
    const userInfoHandler = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserInfo({
        name: user?.user_metadata.name,
        email: user?.email,
      });
    };

    userInfoHandler().finally(() => setIsLoading(false));
  }, []);

  const userInfosData = [
    {
      title: "이름",
      content: userInfo.name,
      skeletonClassName: "w-24",
    },
    {
      title: "이메일",
      content: userInfo.email,
      skeletonClassName: "w-48",
    },
  ];

  return (
    <div className="w-1/2 p-5 bg-white rounded-xl border border-gray-100 shadow-[4px_4px_12px_rgba(149,157,165,0.1)] max-[1025px]:w-[calc(100%-344px)] max-[769px]:w-full">
      <ContentTitle title="회원정보" />
      <div>
        <table className="w-full">
          <colgroup>
            <col width="10%" />
            <col width="90%" />
          </colgroup>
          <tbody>
            {userInfosData.map((info) => (
              <tr key={info.title} className="border-t border-b last:border-t-0 border-gray-100">
                <th className="h-10 text-left text-[14px] text-slate-400 font-medium">{info.title}</th>
                <td className="h-10 text-[14px]">{isLoading ? <InfoWrapperSkeleton className={info.skeletonClassName} /> : info.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
