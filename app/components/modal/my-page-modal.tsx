import { useModalStore } from "@/app/store/modal-store";
import { createPortal } from "react-dom";

interface Props {
  children?: React.ReactNode;
}

export default function MyPageModal({ children }: Props) {
  const close = useModalStore((state) => state.setIsClose);

  return createPortal(
    <section className="w-full h-full fixed inset-0 z-999">
      <div onClick={close} className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />
      <div className="absolute top-1/2 left-1/2 w-[calc(100%-30px)] max-w-100 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white rounded-xl">
        <div className="w-full h-full p-5">{children}</div>
      </div>
    </section>,
    document.body,
  );
}
