import SignSection from "@/app/components/sign/sign-section";
import SignTitle from "@/app/components/sign/sign-title";
import ResendEmailButton from "@/app/components/auth/resend-email-button";
import RestoreSignUpEmail from "@/app/components/auth/restore-signup-email";
import SignupVerificationComplete from "@/app/components/signup-verification-complate";

export default function SignUpCompletePage() {
  return (
    <>
      <SignupVerificationComplete storageKey="reset-password-verification-complete" redirectUrl="/find-password/verified" />
      <RestoreSignUpEmail />
      <SignSection>
        <SignTitle
          title="이메일 발송 완료"
          description={
            <>
              입력하신 이메일로 인증 메일을 보내드렸습니다. <br />
              이메일을 확인하여 인증을 완료해주세요.
            </>
          }
        />
        <ResendEmailButton resendType="recovery" />
        {/* <Link href="/sign-in" replace className="flex items-center justify-center w-full h-[40px] mt-3 bg-(--primary) rounded-md text-white cursor-pointer transition-colors hover:bg-[#4573e9]">
          로그인
        </Link>
        <p className="relative w-full py-3 text-center before:absolute before:left-0 before:top-[50%] before:w-full before:h-[1px] before:bg-slate-200 before:translate-y-[-50%] before:z-0">
          <span className="relative z-1 bg-white px-2 text-sm text-slate-400">또는</span>
        </p>
        <p className="text-center text-sm text-slate-400">
          <Link href="/" replace className="ml-1 text-(--primary) font-medium hover:text-[#4471e2] transition-colors">
            홈
          </Link>
          으로 돌아가기
        </p> */}
      </SignSection>
    </>
  );
}
