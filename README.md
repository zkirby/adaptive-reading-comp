## About

An atomic approach to prompt building. This repo demonstrates an approach to building complex multi-effect prompts:

1. Exhaustively explore and create all possible effects/transformations (these are the 'atoms')
2. Run prompts on all source paragraphs and pairwise rank results.
3. [to implement] Merge and combine winning prompts - repeat step 1.

## Run

- `test.ts`: runs the prompts on the source paragraphs from the reference papers
- `rank.ts`: pairwise ranking of run results
- `translation.ts`: visualization of run and rank results
- `data.json`: source and translation paragraphs

## Reference papers

- (MORE REALISTIC PLANETESIMAL MASSES ALTER KUIPER BELT FORMATION MODELS AND ADD STOCHASTICITY)[https://arxiv.org/pdf/2403.12122.pdf]
- (Fragile Stable Matchings)[https://arxiv.org/pdf/2403.12183.pdf]
- (FEYNMAN–KAC FORMULAS FOR SEMIGROUPS GENERATED BY MULTI-POLARON HAMILTONIANS IN MAGNETIC FIELDS AND ON GENERAL DOMAINS)[https://arxiv.org/pdf/2403.12147.pdf]
- (Regularization in Spider-Style Strategy Discovery and Schedule Construction)[https://arxiv.org/pdf/2403.12869.pdf]
- (ContextVis: Envision Contextual Learning and Interaction with Generative Models)[https://arxiv.org/pdf/2403.12768.pdf]
