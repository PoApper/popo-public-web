import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'semantic-ui-react';
import { PoPoAxios } from '@/lib/axios.instance';

const ActivateAccountPage = () => {
  const router = useRouter();
  const userUuid = router.query.uuid;

  const [isLoading, setIsLoading] = useState(true);
  const [isValidAccount, setIsValidAccount] = useState(false);

  useEffect(() => {
    if (!userUuid) return;

    setIsLoading(true);
    PoPoAxios.put(`/auth/activate/${userUuid}`)
      .then(() => {
        setIsLoading(false);
        setIsValidAccount(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsValidAccount(false);
        alert('올바르지 않은 접근입니다.');
      });
  }, [userUuid]);

  return (
    <div>
      {isLoading ? (
        <div>계정 정보를 확인하고 있습니다...</div>
      ) : isValidAccount ? (
        <div>
          <h2>계정이 활성 되었습니다!</h2>
          <p>
            POSTECH 총학생회에서 운영하는 POPO는 학생 복지와 편의를 제공합니다.
            <br />
            POPO에서 여러 기능들을 사용해보세요!
          </p>
          <br />
          <Button primary href={'/auth/login'}>
            로그인 하러 가기
          </Button>
        </div>
      ) : (
        <div>
          <h2>올바르지 않는 접근입니다.</h2>
        </div>
      )}
    </div>
  );
};

export default ActivateAccountPage;
