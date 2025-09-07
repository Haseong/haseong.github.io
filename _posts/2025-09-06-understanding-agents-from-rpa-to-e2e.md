---
layout: post
title: "에이전트의 이해: RPA에서 E2E까지"
date: 2025-09-06 15:07:26 +0900
author: 정하성
categories: [Blog]
tags: [workflow, rpa, agent, automation, llm, e2e-agent, ai-automation, langgraph]
excerpt: "Workflow 방식은 RPA의 한계를 극복하기 위해 발전했습니다. 하지만 여전히 규칙 기반이라 예외 상황 대응이 어렵습니다. E2E 방식은 인간처럼 상황 판단과 행동 교정이 가능합니다. AI 기반 자동화의 새로운 패러다임으로 주목받고 있습니다."
banner_image: "/assets/images/posts/2025-09-06-workflow-evolution-and-limitations.jpg"
---

![](/assets/images/posts/2025-09-06-workflow-evolution-and-limitations.jpg)

에이전트란 무엇인가. 에이전트는 전통적 방식에서 시작해 RPA, Workflow를 거쳐 현재의 E2E 방식으로 진화해왔다. RPA로 전통적으로 수익을 창출해온 Zapier 같은 기업들이 1세대 에이전트를 대표한다면, Workflow 방식이 2세대 에이전트이고, 오늘 소개할 E2E 방식이 3세대 에이전트라고 할 수 있다.

RPA는 우리가 일반적으로 생각하는 매크로 방식이다. 티켓 예매나 데이터 크롤링처럼 마우스와 키보드 이벤트를 기록하고 재생하는 일련의 정적인 자동화 과정이었다. 초기 RPA는 PC에서 주로 작업했으며, 마우스와 키보드의 정확한 움직임을 그대로 재현하는 방식으로 동작했다. 이후 헤드리스 브라우저가 등장하면서 단순한 이벤트 재생을 넘어 DOM 파싱을 통한 보다 정확한 처리가 가능해졌다.

실제로 2024년 기준 RPA 시장은 228억 달러 규모로 성장했으며, 2034년까지 2,110억 달러로 확대될 전망이다. 시장의 선두주자인 UiPath는 연간 반복 수익 16.7억 달러를 달성하며 1만 개 이상의 고객사를 확보했다. 하지만 이들조차 전통적 RPA의 한계를 인식하고 AI 기반 "Agentic Automation Platform"으로의 전환을 선언했다. Automation Anywhere 역시 문서 자동화에서 90% 이상의 정확도를 달성하는 AI 기반 시스템으로 진화하고 있다.

그러나 RPA의 근본적 한계는 명확했다. UI가 조금만 변경되어도 즉시 작동을 멈추고, 예외 상황에 대한 대응이 불가능했다. 정적인 규칙을 벗어나는 순간 인간의 개입이 필수적이었다. 이러한 한계가 2세대 Workflow 방식의 등장을 촉발했다.

## Workflow 방식의 발전과 한계

Workflow 방식에는 다양한 Flow 계열 프로그램과 라이브러리들이 존재한다. Apache Airflow나 Google Dataflow 같은 도구들은 input이나 intent에 따라 처리를 이어가는 형태로, RPA보다는 동적이지만 여전히 모든 상황을 처리할 수는 없었다. 결국 새로운 상황이 발생할 때마다 Workflow를 재설계하거나 추가해야 했다.

LLM이 각광받기 시작하면서 상황은 더욱 복잡해졌다. LLM의 토큰 제한을 극복하기 위해 RAG 기능을 제공하는 LangChain이 등장했다. 하지만 LangChain은 원래 LLM 이전부터 데이터 처리를 위해 존재했던 도구였기에 LLM과 완벽하게 맞아떨어지지 않았다. 이러한 부조화를 해결하기 위해 Graph 관점에서 워크플로우를 설계할 수 있는 LangGraph가 개발되었다.

LangGraph는 에이전트 워크플로우를 방향성 비순환 그래프(DAG)로 모델링한다. 노드, 엣지, 상태의 세 가지 핵심 구성 요소로 이루어져 있다. 노드는 에이전트 로직을 담은 Python 함수이고, 엣지는 다음 실행할 노드를 결정하는 역할을 하며, 상태는 애플리케이션의 현재 상황을 나타내는 공유 데이터 구조다. 이를 통해 복잡한 워크플로우를 체계적으로 관리할 수 있게 되었다. Replit은 수백만 사용자를 위한 코딩 에이전트에, LinkedIn은 자연어를 SQL로 변환하는 내부 도구에 LangGraph를 활용하고 있다.

한편, Asana와 Zapier 같은 기업들은 이미 방대한 RPA와 Workflow 사용자층을 보유하고 있었다. 이들의 성공은 반복적인 정적 업무가 여전히 많다는 것을 의미하며, Workflow 자동화가 수동 작업보다 훨씬 효율적임을 증명한다. Zapier는 2024년 기준 130만 개 기업에서 3억 개 이상의 AI 작업을 처리하며 8,000개 이상의 앱 통합을 제공한다. Asana는 AI Studio를 통해 노코드 빌더로 AI 기반 워크플로우를 생성할 수 있게 했으며, Morningstar의 경우 프로젝트 검토 시간을 2주에서 2분으로 획기적으로 단축했다.

그럼에도 불구하고 Workflow 방식은 여전히 규칙 기반이라는 근본적 한계를 벗어나지 못했다. RPA보다 유연하지만, 정의된 룰을 벗어나는 상황은 처리할 수 없었다. LLM의 잠재력을 완전히 활용하기에는 마치 천재적인 두뇌를 가졌지만 몸은 아직 어린아이인 것과 같은 상태였다. 이러한 한계를 극복할 새로운 패러다임이 필요했다.

## E2E 에이전트의 혁신: 인간 사고방식의 모사

E2E 방식은 2025년 3월부터 본격적으로 제품화되기 시작했다. 대표적인 제품이 Claude Code이며, 이 제품의 동작 원리를 분석한 개발자들이 속속 E2E 방식의 제품들을 만들어내고 있다.

E2E 방식의 가장 큰 특징은 기존 Workflow가 처리하지 못했던 규칙 밖의 상황에서도 작동한다는 점이다. 일반적으로 에이전트에게는 정해진 처리를 맡기는 경우가 많다. 하지만 아무리 정확한 업무를 지시해도 상황이나 조건이 예상을 벗어나면 기존 시스템은 멈춰버렸다. E2E는 이런 예외 상황을 스스로 판단하고 대응한다.

구체적인 예를 들어보면 이해가 쉽다. "내일 소풍을 갈 예정이니 이에 맞는 옷과 음식을 오전 9시에 알려달라"고 에이전트에게 지시했다고 가정해보자. 다음날 비가 온다면, 기존 Workflow 방식은 여전히 소풍에 적합한 김밥과 긴 청바지를 추천할 것이다. 반면 E2E 에이전트는 날씨 변화를 감지하고 실내 활동으로의 전환을 제안한다. 실내에서 즐길 수 있는 음식과 장소를 추천하고, 우산 준비와 적절한 옷차림까지 안내한다.

이러한 차이가 미묘해 보일 수도 있다. Workflow에서도 "비가 오면 어떻게 하라"는 조건문을 추가하면 되지 않느냐고 반문할 수도 있다. 하지만 E2E의 핵심은 이런 조건을 미리 정의하지 않아도 상황에 맞게 대응한다는 것이다. 즉, E2E는 사람처럼 판단하고, 계획을 수립하며, 행동한다.

여기서 가장 중요한 것은 '행동의 교정'이다. Workflow 방식은 오류가 발생하면 처리를 멈추지만, E2E는 오류를 인식하고 계획을 수정하며 행동을 교정한다. 이는 인간이 새로운 일을 수행할 때와 동일한 방식이다. 우리는 해보지 않은 일을 할 때 유사한 경험을 참조하여 가정을 세우고, 이를 바탕으로 계획을 수립한 뒤 실행한다. 문제가 발생하면 계획을 수정하고 다시 시도한다.

이러한 동작 방식을 'Trial & Error'라고 부른다. LLM 학습에서 보상 처리를 통해 개선하듯이, E2E 에이전트도 Trial & Error를 통해 지속적으로 작동한다. 이처럼 무한히 반복되는 특성 때문에 'AgentLoop'라고도 불리며, 이는 E2E와 같은 개념이다.

물론 E2E 에이전트도 완전히 백지 상태에서 시작하는 것보다는 기초 정보가 있는 것이 효율적이다. Workflow 방식의 장점인 체계적 처리를 활용하되, E2E의 유연성을 더한다면 최적의 결과를 얻을 수 있다. 에이전트가 학습한 사실이나 계획을 문서로 정리하여 제공하면 Trial & Error 횟수를 크게 줄일 수 있다. 이는 매우 중요한데, 반복 횟수는 곧 토큰 사용량이고 비용이기 때문이다. 따라서 LLM이 가장 잘 이해하는 Markdown 형식으로 문서를 제공하는 것이 가장 효과적이다.

## 휴머노이드 시대를 위한 E2E의 의미

E2E 방식으로 처리하고 코드를 생성하는 것이 중요한 이유는 명확하다. 인간이 LLM을 통해 궁극적으로 만들려는 것은 휴머노이드이기 때문이다. 현재는 소프트웨어적으로 인간의 업무를 대체하는 수준이지만, 최종 목표는 인간의 물리적 움직임과 노동까지 대체하는 휴머노이드다.

휴머노이드가 움직이려면 무엇이 필요한가. 인간의 사고 과정을 살펴보면 답이 보인다. 우리는 복잡한 작업을 수행할 때 1, 2, 3, 4와 같이 순차적으로 계획을 세우고 노트에 기록한다. 각 단계를 수행하면서 완료된 항목은 체크하고 다음으로 넘어간다. 각 주요 단계 아래에는 수많은 세부 작업이 존재하며, 이는 무한한 계획과 무한한 행동의 연속이다. 이러한 프로세스는 소프트웨어 에이전트든 휴머노이드든 동일하게 필요하다.

인간이 이를 효과적으로 처리할 수 있는 것은 전전두엽의 작업기억 덕분이며, 이는 우리가 하는 프로그래밍과 놀랍도록 유사하다. 따라서 E2E 방식으로 실시간 코드 생성과 수정이 가능해야 하는 것이다. 계획과 행동 모두가 동적으로 조정되어야 한다.

도구의 활용 측면에서도 시사점이 있다. 다양한 도구가 있으면 작업이 유리하고 빠를 수 있다. 하지만 인간은 망치 하나만 있어도 그것으로 다른 도구를 만들거나 대체 방법을 찾아 훌륭히 일을 수행한다. 에이전트도 마찬가지다. 중요한 것은 도구의 다양성보다 상황에 맞게 활용하고 교정하는 메커니즘이다. LLM은 이미 충분히 훌륭한 답을 제시할 수 있다. 우리가 집중해야 할 것은 이러한 교정 메커니즘의 효율화다. 이것이 바로 무한한 도구를 만들어낼 수 있는 '메타 레시피'인 것이다.

어느 순간 E2E가 일반화되면, 지금 우리가 컴퓨터의 동작 원리를 깊이 알지 못해도 잘 사용하는 것처럼, E2E의 내부 원리를 몰라도 활용하는 데 지장이 없을 것이다. PC의 작동 원리를 양자역학 수준까지 이해한다고 해서 더 잘 사용하는 것은 아니지 않은가.

하지만 지금은 다르다. 대부분이 이 기술의 차이와 의미를 모르는 초기 단계에서는 원리를 정확히 아는 것이 경쟁 우위가 된다. 초기 단계에서는 원리를 이해해야만 비즈니스를 설계할 수 있고, 세상이 필요로 하는 제품을 만들 수 있다. 이 원리를 심도 있게 탐구하는 것이 향후 10년의 미래를 결정할 것이라 확신한다.

## 참고 자료

1. [Precedence Research. (2024). Robotic Process Automation Market Size to Surge USD 211.06 Billion by 2034](https://www.precedenceresearch.com/robotic-process-automation-market)
2. [UiPath. (2024). Agentic Automation Platform Announcement](https://www.techtarget.com/searchitoperations/news/366623399/UiPath-AI-agents-blend-with-RPA-amid-industry-hype-doubts)
3. [Automation Anywhere. (2024). AI + Automation Enterprise System](https://www.automationanywhere.com/company/press-room/automation-anywhere-unveils-new-ai-automation-enterprise-system-empowering)
4. [Apache Airflow Documentation. (2024). MLOps with Apache Airflow](https://airflow.apache.org/use-cases/mlops/)
5. [LangChain. (2024). LangGraph Documentation and Release Notes](https://langchain-ai.github.io/langgraph/)
6. [Zapier. (2024). AI Orchestration Platform Report](https://zapier.com/ai)
7. [Asana. (2024). AI Studio Launch Announcement](https://asana.com/inside-asana/introducing-ai-studio)
8. [Anthropic. (2024). Introducing Claude 4 and Extended Thinking](https://www.anthropic.com/news/claude-4)
9. [Microsoft. (2024). Azure Logic Apps AgentLoop Documentation](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%93%A2announcing-agent-loop-build-ai-agents-in-azure-logic-apps-%F0%9F%A4%96/4415052)
10. [Google. (2024). Agent Development Kit (ADK) LoopAgent Documentation](https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/)
11. [Stanford University. (2023). Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
12. [Morgan Stanley. (2024). Humanoid Robot Market Expected to Reach $5 Trillion by 2050](https://www.morganstanley.com/insights/articles/humanoid-robot-market-5-trillion-by-2050)
13. [CB Insights. (2024). AI Agent Market Map and Revenue Report](https://www.cbinsights.com/research/ai-agent-startups-top-20-revenue/)
14. [Crunchbase. (2024). AI Autonomous Agents Investment Trends](https://news.crunchbase.com/ai/autonomous-agents-top-seed-trend-2025/)
15. [Boston Consulting Group. (2024). AI Adoption in 2024: Companies Struggle to Scale Value](https://www.bcg.com/press/24october2024-ai-adoption-in-2024-74-of-companies-struggle-to-achieve-and-scale-value)
16. [McKinsey & Company. (2024). Why AI Agents are the Next Frontier of Generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/why-agents-are-the-next-frontier-of-generative-ai)
17. [EU Commission. (2024). EU AI Act Implementation Guidelines](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
18. [World Economic Forum. (2024). AI Governance Trends Report](https://www.weforum.org/stories/2024/09/ai-governance-trends-to-watch/)