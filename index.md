---
layout: default
title: Engineering Notes
nav_exclude: true
permalink: /
portfolio_home: true
---
<section class="portfolio-hero" aria-labelledby="hero-title">
  <p class="eyebrow">HYEONGYU LEE / ENGINEERING NOTES</p>
  <h1 id="hero-title">차량 소프트웨어를<br>이해하고, 연결하고,<br><span>검증하는 기록.</span></h1>
  <p class="hero-description">AUTOSAR부터 차량 네트워크, 진단과 자동화까지.<br>개념에서 멈추지 않고 코드와 실습으로 이어지는 기술 노트입니다.</p>
  <div class="hero-actions"><a class="portfolio-button" href="#topics">기술 노트 둘러보기 <span aria-hidden="true">↗</span></a><a class="portfolio-secondary" href="https://github.com/HyeonGyu-Lee">GitHub 방문 <span aria-hidden="true">↗</span></a></div>
  <div class="hero-topics"><span>AUTOSAR</span><span>VEHICLE NETWORKS</span><span>DIAGNOSTICS</span></div>
</section>
<section class="portfolio-section" id="topics" aria-labelledby="topics-title">
  <div class="section-heading"><div><p class="eyebrow">EXPLORE THE NOTES</p><h2 id="topics-title">관심 있는 주제부터.</h2></div><span class="section-caption">개념 · 구현 · 검증</span></div>
  <div class="topic-grid">
{% assign roots = site.pages | where: "has_children", true | sort: "nav_order" %}
{% for topic in roots %}
{% unless topic.parent %}
    <a class="topic-card" href="{{ topic.url | relative_url }}">
      <span class="topic-index">{% if topic.nav_order < 10 %}0{% endif %}{{ topic.nav_order }} <span aria-hidden="true">↗</span></span>
      <h3>{{ topic.title | escape }}</h3>
      <p>{% case topic.title %}{% when 'AUTOSAR' %}Classic과 Adaptive 플랫폼, 버전별 구조와 설정을 살펴봅니다.{% when '차량 통신' %}CAN, LIN부터 Automotive Ethernet까지 연결과 검증을 다룹니다.{% when 'A-SPICE' %}요구사항부터 검증까지, 개발 프로세스와 산출물을 연결합니다.{% when 'ISO26262' %}기능 안전의 개념을 설계와 검증 관점으로 정리합니다.{% when '기타' %}Electron, Selenium, Markdown으로 개발과 문서화를 돕습니다.{% when 'MCU Peripheral' %}GPIO·ADC·Timer부터 RTOS와 Concurrency까지 구현과 검증을 연결합니다.{% when 'SDV & Vehicle Architecture' %}Zonal Architecture·ROS 2·Zenoh와 차량 소프트웨어 운영을 살펴봅니다.{% when 'Embedded Linux' %}AP의 부팅·IPC·Device I/O와 MCU 연동을 다룹니다.{% when 'Coding Test in C' %}자료구조와 알고리즘을 C 코드와 테스트로 연습합니다.{% when 'UDS (Unified Diagnostic Services)' %}진단 서비스와 응답 코드를 이해하고 통신 흐름을 분석합니다.{% else %}주제별 개념과 구현 예제를 살펴봅니다.{% endcase %}</p>
      {% assign children = site.pages | where: "parent", topic.title %}<span class="topic-meta">{% if children.size > 0 %}{{ children.size }}개 하위 문서 · {% endif %}살펴보기</span>
    </a>
{% endunless %}
{% endfor %}
  </div>
</section>
<section class="portfolio-section" aria-labelledby="path-title">
  <div class="section-heading"><div><p class="eyebrow">FROM THEORY TO PRACTICE</p><h2 id="path-title">읽고, 직접 실행해 보세요.</h2></div></div>
  <div class="learning-paths">
    <a href="{{ '/차량_통신/CAN' | relative_url }}"><span class="path-number">01</span><div><h3>CAN 통신 시작하기</h3><p>프레임 구조를 이해하고 SocketCAN으로 송수신 실습하기</p></div><span aria-hidden="true">↗</span></a>
    <a href="{{ '/차량_통신/Ethernet/DoIP' | relative_url }}"><span class="path-number">02</span><div><h3>진단을 Ethernet으로 확장하기</h3><p>DoIP의 연결과 라우팅, 진단 요청 흐름 따라가기</p></div><span aria-hidden="true">↗</span></a>
    <a href="{{ '/기타/Electron' | relative_url }}"><span class="path-number">03</span><div><h3>데스크톱 도구 만들기</h3><p>Electron의 프로세스 구조와 IPC 예제로 구현 시작하기</p></div><span aria-hidden="true">↗</span></a>
  </div>
</section>
<div class="portfolio-signoff"><span>HyeonGyu Lee</span><span>계속 배우고, 기록하고, 개선합니다.</span></div>
