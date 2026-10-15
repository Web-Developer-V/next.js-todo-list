import TitleArea from "../layout/title-area";
import InfoWrapper from "./info-wrapper";
import ManageWrapper from "./manage-wrapper";

export default function MyPageContainer() {
  return (
    <div className="w-full max-w-300 mx-auto">
      <TitleArea title="마이페이지" content="회원님의 정보를 확인할 수 있어요." />
      <section className="flex items-start gap-x-6 max-[769px]:flex-col max-[769px]:gap-x-0 gap-y-6">
        <InfoWrapper />
        <ManageWrapper />
      </section>
    </div>
  );
}
