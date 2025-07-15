# How to setup local certificates

로컬에서 popo-{admin,public}-web 웹을 개발할 때, https를 적용하는 방법에 대해 다룹니다.

요걸 세팅 해야 popo-nest-api에서 HTTPS 엔드포인트를 요구하는 각종 auth 및 cookie 기반 Request를 로컬에서도 테스트 할 수 있습니다.

https://vercel.com/guides/access-nextjs-localhost-https-certificate-self-signed

위의 NextJS 문서에 따르면, `next dev` 명령어에 `--experimental-https`만 붙여주면 된다고 한다.

```sh
$ next dev --experimental-https
```

요 내용은 `package.json`에 이미 반영 되어 있다.

그리고 `npm run dev`로 dev 환경을 실행하면, 아래와 같이 self-signed cert를 생성하기 위한 절차가 시작된다.

```
Attempting to generate self signed certificate. This may prompt for your password
Sudo password:
```

가이드 대로 본인의 root password를 입력하면, 루트 경로에 `certificates/`란 폴더에 `localhost-key.pem`과 `localhost.pem`이 생성되고, NextJS app을 https로 실행할 수 있다.

## NODE_TLS_REJECT_UNAUTHORIZED

ENV에 요 값을 아래와 같이 세팅해야 한다.

```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

그래야 self-signed cert를 사용해도 SSR과 API 요청을 할 수 있다.

## Chrome Allow Insecure Localhost

~~또, 크롬에서도 insecure localhost에 대한 접속을 허용해줘야 한다. `chrome://flags/#allow-insecure-localhost` 경로로 이동해서 해당 옵션을 Enabled로 바꾸자.~~

크롬이 업데이트됨에 따라 해당 설정값 사라짐

## 위 방법을 시도했을 때도 안된다면

2025.07.15 일자 수정  

`local-certs` 폴더에서 아래 명령어를 실행

```sh
$ mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1
```
프론트에서도 동일한 명령어를 실행해야 한다.

해당 명령어는 다음을 모두 커버한다:
- localhost (도메인으로 요청 시)
- 127.0.0.1 (IPv4로 요청 시)
- ::1 (IPv6로 요청 시)

이래도 안된다면 트러블슈팅 후 이어서 작성해주시길..