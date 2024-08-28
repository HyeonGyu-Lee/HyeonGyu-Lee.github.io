---
layout: default
title: COM
has_children: false
published_date: 2024-08-28-09-08-00
last_modified_date: 2024-08-28-11-08-00
nav_order: 4
parent: '기타'
permalink: '/기타/COM'
redirect_from:
 - /b70a3e94ccc24769aa2c67939878791c
 - /undefined
---
<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
COM(Component Object Model)은 마이크로소프트에서 개발한 소프트웨어 기술로, 다양한 애플리케이션이 서로 간에 객체(오브젝트)를 공유하고 재사용할 수 있도록 하는 프레임워크입니다. COM은 언어와 플랫폼에 독립적이기 때문에, COM 기반의 객체는 C++, C#, Visual Basic, Python 등 다양한 프로그래밍 언어로 작성된 애플리케이션에서 사용할 수 있습니다.
</div>
</div>
</blockquote>



# **COM의 주요 개념**

1. COM 객체: COM 객체는 인터페이스를 통해 상호작용할 수 있는 객체입니다. 이 객체는 특정 기능을 구현하고, 인터페이스는 이 객체의 기능에 접근할 수 있는 방법을 정의합니다.
2. 인터페이스: 인터페이스는 클래스의 메서드 집합을 정의하며, COM에서 객체는 인터페이스를 통해 접근됩니다. 각 인터페이스는 고유한 식별자를 가지며, 이 식별자는 GUID(Globally Unique Identifier)로 표현됩니다.
3. IUnknown 인터페이스: 모든 COM 객체는 IUnknown 인터페이스를 구현해야 합니다. 이 인터페이스는 참조 카운팅과 인터페이스 쿼리 기능을 제공합니다.
    - QueryInterface: 객체가 지원하는 인터페이스를 요청합니다. 
    - AddRef: 객체의 참조 카운트를 증가시킵니다. 
    - Release: 객체의 참조 카운트를 감소시키며, 카운트가 0이 되면 객체를 메모리에서 해제합니다.
4. COM 서버와 클라이언트: COM 객체는 COM 서버에서 생성되고 관리됩니다. COM 서버는 DLL(동적 링크 라이브러리) 또는 EXE(실행 파일)로 구현될 수 있습니다. COM 클라이언트는 이러한 COM 객체를 사용하여 필요한 작업을 수행합니다.
5. COM의 등록 및 활성화: COM 객체를 사용하기 위해서는 먼저 COM 서버가 레지스트리에 등록되어야 합니다. 이를 통해 클라이언트가 COM 객체의 CLSID(Class ID)를 사용하여 객체를 생성하고, 해당 객체의 인터페이스에 접근할 수 있습니다.
