---
layout: default
title: "Csm"
has_children: false
parent: "Security Services"
nav_order: 2
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Security_Services/Csm'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a819ebf2cd2b96a3e80b7"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Csm의 역할
> Crypto Service Manager. 상위 사용자의 암호 서비스 요청과 하위 암호 기능 사이의 관리 계층을 다룬다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Csm |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Csm (CryptoServiceManager) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| CsmAsymDecrypt | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of AsymDecrypt primitives. |
| CsmAsymEncrypt | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of AsymEncrypt primitives. |
| CsmAsymPrivateKeyExtract | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of AsymPrivateKeyExtract primitives. |
| CsmAsymPrivateKeyUpdate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Asymmetric Private Key Update primitives. |
| CsmAsymPrivateKeyWrapAsym | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of AsymPrivateKeyWrapSym primitives. |
| CsmAsymPrivateKeyWrapSym | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of AsymPrivateKeyWrapSym primitives. |
| CsmAsymPublicKeyExtract | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of AsymPublicKeyExtract primitives. |
| CsmAsymPublicKeyUpdate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Asymmetric Public Key Update primitives. |
| CsmChecksum | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Checksum primitives. |
| CsmCompression | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Compression primitives. |
| CsmDecompression | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Decompression primitives. |
| CsmGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container for common configuration options. |
| CsmHash | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Hash primitives. |
| CsmKeyDerive | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of KeyDerive primitives. |
| CsmKeyDeriveSymKey | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of CsmKeyDeriveSymKey primitives. |
| CsmKeyExchangeCalcPubVal | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of KeyExchangeCalcPubVal primitives. |
| CsmKeyExchangeCalcSecret | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of KeyExchangeCalcSecret primitives. |
| CsmKeyExchangeCalcSymKey | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of KeyExchangeCalcSymKey primitives. |
| CsmMacGenerate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of MacGenerate primitives. |
| CsmMacVerify | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of MacVerify primitives. |
| CsmRandomGenerate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of RandomGenerate primitives. |
| CsmRandomSeed | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of RandomSeed primitives. |
| CsmSignatureGenerate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SignatureGenerate primitives |
| CsmSignatureVerify | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SignatureVerify primitives. |
| CsmSymBlockDecrypt | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymBlockDecrypt primitives. |
| CsmSymBlockEncrypt | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymBlockEncrypt primitives. |
| CsmSymDecrypt | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymDecrypt primitives |
| CsmSymEncrypt | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymEncrypt primitives. |
| CsmSymKeyExtract | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymKeyExtract primitives. |
| CsmSymKeyGenerate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Symmetric Key Generate primitives. |
| CsmSymKeyUpdate | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of Symmetric Key Update primitives. |
| CsmSymKeyWrapAsym | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymKeyWrapSym primitives. |
| CsmSymKeyWrapSym | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for incorporation of SymKeyWrapSym primitives. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Csm" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
