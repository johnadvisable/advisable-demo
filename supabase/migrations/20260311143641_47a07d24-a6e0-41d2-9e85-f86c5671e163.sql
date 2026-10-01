UPDATE public.insights_translations
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                content,
                '<p>AI accelerates software development, but that acceleration can expose weaknesses downstream. Without robust control systems, strong automated testing, mature version control practices, fast feedback loops, an increase in change volume leads to instability.</p>',
                '<p><strong>AI accelerates software development, but that acceleration can expose weaknesses downstream. Without robust control systems, strong automated testing, mature version control practices, fast feedback loops, an increase in change volume leads to instability.</strong></p>'
              ),
              '<p>AI code suggestion systems are designed to suggest adding code, not to update, move, or delete existing code. The result is systems that grow by accretion rather than by architectural improvement, accumulating redundancy and complexity rather than consolidating it.</p>',
              '<p><strong>AI code suggestion systems are designed to suggest adding code, not to update, move, or delete existing code. The result is systems that grow by accretion rather than by architectural improvement, accumulating redundancy and complexity rather than consolidating it.</strong></p>'
            ),
            '<p>The connection to debt is direct. Duplicated code is maintenance overhead: when a change needs to be made, every instance of that code must be found and updated individually, increasing the risk of inconsistency and bugs.</p>',
            '<p>The connection to debt is direct. Duplicated code is maintenance overhead: <strong>when a change needs to be made, every instance of that code must be found and updated individually, increasing the risk of inconsistency and bugs.</strong></p>'
          ),
          '<p>The result: developers using AI tools took 19% longer to complete tasks than those working without them.</p>',
          '<p><strong>The result: developers using AI tools took 19% longer to complete tasks than those working without them.</strong></p>'
        ),
        '<p>Traditional technical debt accumulates because developers make deliberate shortcuts: choosing a quick fix over a proper solution to meet a deadline, deferring documentation, implementing a workaround rather than redesigning an interface. These decisions are typically made consciously, by developers who understand what they are trading off. The debt is known, even if it goes unaddressed.</p>',
        '<p><strong>Traditional technical debt accumulates because developers make deliberate shortcuts: choosing a quick fix over a proper solution to meet a deadline, deferring documentation, implementing a workaround rather than redesigning an interface.</strong> These decisions are typically made consciously, by developers who understand what they are trading off. The debt is known, even if it goes unaddressed.</p>'
      ),
      '<p>AI-assisted technical debt accumulates differently. The code AI generates is often syntactically correct and functionally adequate in isolation. It passes initial review. It works in testing.</p>',
      '<p><strong>AI-assisted technical debt accumulates differently. The code AI generates is often syntactically correct and functionally adequate in isolation. It passes initial review. It works in testing.</strong></p>'
    ),
    '<p>The problems it creates, architectural inconsistency, duplicated logic, violated conventions, dependencies that will become unmaintainable as the codebase grows, are not visible at the point of generation. They emerge over time, as the volume of AI-generated code grows and the absence of architectural coherence becomes apparent.</p>',
    '<p><strong>The problems it creates, architectural inconsistency, duplicated logic, violated conventions, dependencies that will become unmaintainable as the codebase grows, are not visible at the point of generation.</strong> <strong>They emerge over time, as the volume of AI-generated code grows and the absence of architectural coherence becomes apparent.</strong></p>'
  ),
  '<p>One reason AI-assisted technical debt accumulates without early warning is that the metrics most product and engineering teams track are designed to measure throughput, not structural health.</p>',
  '<p>One reason AI-assisted technical debt accumulates without early warning is that <strong>the metrics most product and engineering teams track are designed to measure throughput, not structural health.</strong></p>'
)
WHERE id = 'bedd0412-6588-4ec6-8776-717e3efce55e';
