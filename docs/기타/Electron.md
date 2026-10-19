---
layout: default
title: Electron
has_children: false
published_date: 2026-10-12-11-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 5
parent: '기타'
permalink: '/기타/Electron'
redirect_from:
 - "/3f71b412900a8118a22accad6ce0e215"
---
## 화면에서 요청한 작업을 OS 기능으로 수행하는 상황


Renderer, preload와 main process는 권한과 실행 환경이 다르다. IPC를 좁은 계약으로 설계하면 UI 입력이 임의의 filesystem·process 접근으로 확장되는 것을 줄일 수 있다.


> 프로세스 책임과 제한된 IPC를 구현하고 보안 경계·배포 환경의 동작을 확인한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
실행 예제의 주소·선택자·인터페이스·설정값은 시험 환경에 맞게 변경한다. 규격의 적용 판과 도구 버전을 확인한다.
</div>
</div>
</blockquote>



### 핵심 개념


Electron은 Chromium과 Node.js를 바탕으로 웹 기술을 데스크톱 애플리케이션에 사용하는 프레임워크다. Windows·macOS·Linux에서 동작할 수 있지만 배포 패키지, 권한, OS 연동과 시험은 플랫폼별로 확인한다.


### 프로세스 구조


Main process는 애플리케이션 수명 주기, 창 생성, OS 기능과 권한이 필요한 작업을 다룬다. Renderer process는 창의 UI를 렌더링한다. Preload는 제한된 기능을 UI에 연결하는 경계로 설계한다.


Renderer에 Node.js나 전체 파일 시스템 접근을 직접 제공하지 않는다. Main과 Renderer 사이에 contextBridge와 IPC로 필요한 기능만 연결하는 방식을 검토한다.


### IPC 설계


요청·응답은 ipcRenderer.invoke와 ipcMain.handle 형태로 구성할 수 있다. 이벤트 전달과 요청·응답을 구분하고, 채널·입력 타입·허용 값·송신 프레임을 검증한다.


contextBridge에 ipcRenderer 전체를 노출하지 않고 작업별 최소 API를 제공한다. 파일 경로나 URL을 받은 뒤 무조건 실행하는 핸들러는 피하고, 허용 범위와 오류 처리를 정의한다.


### 보안 설정과 경계

- contextIsolation을 활성화하고 sandbox 적용을 확인한다.
- Renderer의 nodeIntegration은 비활성화하는 구성을 기본으로 검토한다.
- Content Security Policy, 탐색·새 창 제한, 외부 URL 처리 정책을 정한다.
- 토큰이나 비밀번호를 Renderer·로그·배포 리소스에 넣지 않는다.
- 원격 콘텐츠와 로컬 UI의 신뢰 경계를 구분한다.

위 항목은 설정 하나로 보안이 완성된다는 의미가 아니다. 사용 Electron 버전과 의존성의 업데이트, 권한 요청 처리, IPC 구현을 함께 검토한다.


### 실행과 상태 관리


창 닫기·앱 종료·재활성화의 OS별 동작, 단일 인스턴스 정책, 비동기 작업 중 종료 처리를 정의한다. 설정 저장은 파일 경로·버전·마이그레이션·실패 복구를 고려한다.


### 배포와 업데이트


개발 실행과 배포 실행을 분리해 확인한다. Electron Forge 등 패키징 도구의 지원 범위를 확인하고, 대상 OS별 설치·실행·제거, 코드 서명, macOS notarization, 업데이트 경로를 검토한다.


업데이트는 패키지 무결성과 신뢰 가능한 전달 경로를 유지해야 한다. 개발 환경에서만 동작하는 경로와 네이티브 의존성이 없는지 확인한다.


### 검증 관점

- 최초 실행·반복 실행·종료·재시작과 창 상태.
- IPC의 정상 입력, 잘못된 입력, 권한이 없는 요청과 오류 전파.
- 설정 파일 손상·쓰기 실패와 복구 동작.
- 실제 대상 OS에서 설치·업데이트·제거.
- UI 반응성, 장시간 실행과 자원 사용.

### 설명용 설계 사례


기술 문서를 표시하는 데스크톱 뷰어를 가정한다. Renderer는 문서 목록과 화면 표시를 담당하고 Main은 허용된 문서 디렉터리의 파일 읽기를 담당한다. Preload는 readDocument 같은 제한된 기능만 노출하며, Main은 입력과 접근 경로를 검증한다. 이 사례는 설계 설명이며 실제로 구현하거나 검증한 개인 프로젝트가 아니다.


### 공식 자료


Electron 프로세스 모델: https://www.electronjs.org/docs/latest/tutorial/process-model


Electron 보안 안내: https://www.electronjs.org/docs/latest/tutorial/security


Electron IPC 안내: https://www.electronjs.org/docs/latest/tutorial/ipc


Electron Forge: https://www.electronforge.io/


### 실습: 제한된 IPC로 UI에 기능 제공


Electron 프로젝트의 CommonJS main.cjs·preload.cjs와 로컬 HTML을 사용하는 작은 예제다. 개발 의존성에 Electron을 설치하고 package.json의 main을 main.cjs로 지정한다.


main.cjs:


```javascript
const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  ipcMain.handle("app:version", (event) => {
    if (event.sender !== win.webContents ||
        event.senderFrame !== win.webContents.mainFrame) {
      throw new Error("허용되지 않은 요청")
    }
    return app.getVersion()
  })
  win.loadFile("index.html")
})
```



preload.cjs:


```javascript
const { contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld("appInfo", {
  version: () => ipcRenderer.invoke("app:version"),
})
```



Renderer는 window.appInfo.version()을 호출하고 반환값을 textContent로 표시한다. ipcRenderer 전체를 노출하지 않는다. 이 최소 예제에 실제 배포를 위한 CSP·탐색 제한·권한 처리·앱 종료 정책을 추가한다.


### 검증 실습


정상 창에서 버전 표시 → 다른 프레임 요청 거부 → 창 재시작 → 배포 패키지에서 preload 경로 확인 순서로 시험한다. 파일 접근 API로 확장할 때는 경로 범위·타입·권한을 main에서 검증한다.


## 이해를 확인하는 질문


> Renderer가 보낸 IPC message를 그대로 신뢰해도 될까?


채널, 입력 형식과 권한을 main에서 검증해야 한다. Context isolation은 입력 검증을 대신하지 않는다.

