---
layout: default
title: COM (Component Object Model)
has_children: false
published_date: 2024-08-28-09-08-00
last_modified_date: 2026-10-19-22-10-00
nav_order: 4
parent: '기타'
permalink: '/기타/COM_(Component_Object_Model)'
redirect_from:
 - "/b70a3e94ccc24769aa2c67939878791c"
 - "/기타/COM"
---
## 다른 언어로 만든 component의 interface를 호출하는 상황


COM은 binary interface와 object lifetime, interface discovery의 계약을 제공한다. 호출 가능한 method와 reference count, apartment model이 함께 맞아야 component 경계를 안전하게 넘는다.


> Microsoft Component Object Model의 객체·interface와 상호 운용 개념을 정리한 문서다. AUTOSAR COM 통신 모듈과는 다른 주제다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
규격·도구 버전에 따른 동작 차이를 확인한다.
</div>
</div>
</blockquote>



<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
COM(Component Object Model)은 마이크로소프트에서 개발한 software 기술로, 다양한 application이 서로 간에 객체(오브젝트)를 공유하고 재사용할 수 있도록 하는 framework입니다. COM은 언어와 플랫폼에 독립적이기 때문에, COM 기반의 객체는 C++, C#, Visual Basic, Python 등 다양한 프로그래밍 언어로 작성된 application에서 사용할 수 있습니다.<br>**오브젝트와 시스템이 개방적이고 변화 가능한 방식으로 상호 동작할 수 있는 방법을 정의하는 다수의 기술에 대한 바이너리 사양**
</div>
</div>
</blockquote>



# **COM의 주요 개념**

1. COM 객체: COM 객체는 interface를 통해 상호작용할 수 있는 객체입니다. 이 객체는 특정 기능을 구현하고, interface는 이 객체의 기능에 접근할 수 있는 방법을 정의합니다.
2. interface: interface는 클래스의 메서드 집합을 정의하며, COM에서 객체는 interface를 통해 접근됩니다. 각 interface는 고유한 식별자를 가지며, 이 식별자는 GUID(Globally Unique Identifier)로 표현됩니다.
3. IUnknown interface: 모든 COM 객체는 IUnknown interface를 구현해야 합니다. 이 interface는 참조 카운팅과 interface 쿼리 기능을 제공합니다.
    - QueryInterface: 객체가 지원하는 interface를 요청합니다. 
    - AddRef: 객체의 참조 카운트를 증가시킵니다. 
    - Release: 객체의 참조 카운트를 감소시키며, 카운트가 0이 되면 객체를 메모리에서 해제합니다.
4. COM server와 client: COM 객체는 COM server에서 생성되고 관리됩니다. COM server는 DLL(동적 link 라이브러리) 또는 EXE(실행 파일)로 구현될 수 있습니다. COM client는 이러한 COM 객체를 사용하여 필요한 작업을 수행합니다.
5. COM의 등록 및 활성화: COM 객체를 사용하기 위해서는 먼저 COM server가 레지스트리에 등록되어야 합니다. 이를 통해 client가 COM 객체의 CLSID(Class ID)를 사용하여 객체를 생성하고, 해당 객체의 interface에 접근할 수 있습니다.

## 1. COM 객체 (**COM Object)**


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
COM 기술의 핵심 단위로, 특정 기능을 캡슐화하여 다른 application이나 구성 요소에서 사용할 수 있는 독립적인 software 구성 요소<br>COM 객체는 특정 작업을 수행하는 메서드와 데이터를 포함하고 있으며, 객체 지향적 프로그래밍의 원칙을 따름<br>**COM 객체**는 특정 기능을 **캡슐화**한 독립적인 구성 요소로, 다양한 application에서 **재사용**될 수 있고, **언어 독립적**임
</div>
</div>
</blockquote>



### 1-1. 독립성

- COM 객체는 독립적으로 생성되고, 특정 application에만 종속되도록 설계할 필요는 없음
- 따라서 다양한 application에서 재사용될 수 있음
- 다른 프로그래밍 언어로 작성된 코드에서도 사용

### 1-2. 이진 호환성

- COM 객체는 이진 수준에서의 호환성을 제공하므로, 객체를 사용하는 application이 어떤 언어로 작성되었든 상관없이 통신이 가능
- 이로 인해 COM 객체는 여러 환경에서 일관되게 작동할 수 있음

### 1-3. 위치 투명성

- COM 객체는 로컬 시스템이나 network를 통해 원격에서 접근할 수 있음
- Distributed COM(DCOM)을 사용하면, 객체의 물리적 위치와 관계없이 동일한 방식으로 접근할 수 있음

### 1-4. 참조 카운트 관리

- COM 객체는 참조 카운트를 기반으로 메모리를 관리
- 객체가 더 이상 참조되지 않으면 참조 카운트가 0이 되고, 이때 객체는 메모리에서 해제됨

## 2. interface (Interface)


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
COM 객체가 제공하는 기능에 접근하는 방법을 정의하는 계약(contract)<br>interface는 특정 기능을 수행하는 메서드의 집합으로, 이 메서드를 통해 외부에서 객체의 기능을 사용할 수 있음<br>**interface**는 COM 객체의 기능에 접근하는 **계약**으로, 객체의 구현 세부 사항을 감추고, 다수의 언어에서 **일관된 방식**으로 사용할 수 있게 함
</div>
</div>
</blockquote>



### 2-1. 계약 기반 상호작용

- interface는 객체가 제공하는 기능을 정의하는 계약
- interface를 사용하면 객체 내부의 구현 세부 사항에 대한 지식 없이도 객체의 기능을 사용할 수 있고, 이는 모듈화와 유연성을 높임

### 2-2. 언어 독립성

- interface는 이진 표준을 사용하여 정의되므로, C++, Visual Basic, C# 등 다양한 프로그래밍 언어에서 동일한 interface를 사용할 수 있음
- 이로 인해 다양한 언어로 작성된 application 간에 상호 운용성이 보장됨

### 2-3. 고유 식별자(IID)

- 각 interface는 고유한 식별자(Interface Identifier; IID)를 가지며, 이 식별자를 통해 특정 interface에 접근할 수 있음
- COM 객체는 여러 interface를 구현할 수 있으며, ‘QueryInterface’ 메서드를 통해 필요한 interface에 대한 포인터를 요청할 수 있음

### 2-4. 다중 interface 구현

- COM 객체는 여러 interface를 구현할 수 있음
- 하나의 객체가 IUnknown, IDispatch, ICustomInterface 등의 여러 interface를 구현할 수 있으며, 각 interface는 객체의 서로 다른 기능을 제공

## 3. IUnknown (Interface)


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
COM에서 사용되는 기본 interface, 모든 COM interface는 IUnknown을 상속받음<br>COM 객체의 수명 관리와 interface 검색 기능을 제공하는데 필수<br>**QueryInterface** 메서드를 통해 런타임에 객체가 지원하는 interface에 접근할 수 있게 해주고, 이로 인해 client는 특정 interface에 의존하지 않고도 다양한 COM 객체를 사용할 수 있음<br>**AddRef** 와 **Release** 메서드를 통해 객체의 수명을 관리하며, 이를 통해 메모리 관리를 자동화함
</div>
</div>
</blockquote>



### 3-1. QueryInterface (Method)

- 이 메서드는 특정 interface의 포인터를 요청하는데 사용됨
- COM 객체는 여러 interface를 구현할 수 있으며, 이 메서드를 통해 해당 interface에 접근할 수 있음
- 요청한 interface를 지원하면 해당 interface의 포인터를 반환하고, 지원하지 않으면 ‘E_NOINTERFACE’ 반환

### 3-2. AddRef (Method)

- 이 메서드는 참조 카운트를 증가시키는 역할을 함
- COM 객체는 참조 카운트 방식으로 메모리 관리를 수행하며, AddRef를 호출하여 객체의 수명을 연장할 수 있음

### 3-3. Release (Method)

- 이 메서드는 참조 카운트를 감소시키고, 참조 카운트가 0이 되면 객체를 메모리에서 해제
- 이 방식으로 COM은 메모리 누수를 방지함

# 기타 용어 및 기능


## 1. CoInitialize

- COM 라이브러리를 초기화 하는 함수
- COM 객체를 사용하는 application에서 반드시 호출해야 하는 함수
- COM의 thread 모델을 설정하고, 해당 thread에서 COM 기능을 사용할 수 있도록 환경을 설정

### 1-1. 초기화

- ‘CoInitialize’는 COM 라이브러리를 초기화하여, COM을 사용하기 전에 호출해야 함
- 이 함수는 성공 시 ‘S_OK’를 반환하고, 이미 초기화된 경우 ‘S_FALSE’를 반환

### 1-2. thread 모델

- COM은 단일 thread 아파트먼트(STA)와 멀티 thread 아파트먼트(MTA)라는 두 가지 thread 모델을 제공
- ‘CoInitialize’는 기본적으로 STA를 초기화하며, 멀티 thread 아파트먼트를 사용하려면 ‘CoInitializeEx’를 사용해야함

### 1-3. 정리

- COM 사용이 끝나면 ‘CoUninitialize’를 호출하여 초기화된 COM 라이브러리를 해제해야 함
- 이를 통해 메모리 누수를 방지하고, 리소스를 적절히 해제할 수 있음

## 2. CoCreateInstance

- COM 객체를 생성하고, 해당 객체의 특정 interface에 대한 포인터를 반환하는 함수
- COM 객체를 동적으로 생성할 때 주로 사용

### 2-1. 객체 생성

- ‘CoCreateInstance’는 지정된 CLSID(클래스 식별자; Class Identifier)를 기반으로 새로운 COM 객체를 생성
- 이때 해당 객체는 요청된 interface의 인스턴스를 제공

### 2-2. interface 포인터 반환

- 객체가 생성되면 ‘CoCreateInstance’는 요청된 interface에 대한 포인터를 반환
- 이 포인터는 객체와의 상호작용에 사용

### 2-3. 파라미터

- ‘CoCreateInstance’는 CLSID, 객체가 생성될 컨텍스트(로컬, 원격 등), 그리고 요청된 interface의 식별자(IID) 등을 파라미터로 받

## 이해를 확인하는 질문


> Interface pointer를 복사하면 lifetime도 자동 연장될까?


소유권 계약에 맞는 reference 관리가 필요하다. Raw pointer 복사와 AddRef는 같은 동작이 아니다.

