import ListAddWrapper from "./list-add-wrapper";
import ListWrapper from "./list-wrapper";
import TitleArea from "../layout/title-area";

export default function TodoContainer() {
  return (
    <div className="w-full max-w-300 mx-auto">
      <TitleArea title="할 일 리스트" content="오늘도 한걸음 더 나아가 보세요." />
      <section className="flex items-start gap-x-6 max-[769px]:flex-col max-[769px]:gap-x-0 gap-y-6">
        <ListWrapper />
        <ListAddWrapper />
      </section>
    </div>
  );
}
