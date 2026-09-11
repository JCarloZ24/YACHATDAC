/**
 * Full Record articles supplied by the user on 2026-09-11 (D5/F8).
 * Copy source: docs/content/drafts/the-record/articles/*.md, transcribed from
 * docs/revisions/the-record-content/*.pdf. PDF line wraps are joined; quotations
 * and bracketed name queries are retained. CR3/D17, CR4 and Country casing apply
 * only to narration. Sources are the supplied citations, not a new fact check.
 * Structured blocks preserve CMS-editable text (D12); no content-string parsing.
 */

export type RecordArticleBlock =
  | { kind: "paragraph" | "heading" | "label" | "law" | "pullquote" | "quote" | "emphasis" | "note"; text: string }
  | { kind: "image"; mediaId: string; caption?: string };

export type RecordArticle = {
  title: string;
  standfirst: string;
  sourceDocument: string;
  blocks: readonly RecordArticleBlock[];
  sources: readonly { text: string; href?: string }[];
};

/** Article interface labels, recorded in the Resources draft amendment (D5). */
export const recordArticleCopy = {
  sources: "Sources",
  back: "Back to the record",
  related: "Related in the record",
  pendingLabel: "Not built yet",
  pendingBody: "This article is being prepared. Its title and summary are available in the record.",
};

export const recordArticles: Readonly<Record<string, RecordArticle>> = {
  "fifteen-thousand-markings-read-in-order": {
    "title": "Fifteen thousand markings, read in order.",
    "standfirst": "Two ways of reading the same wall — what the study found, and what Iningai law already held.",
    "sourceDocument": "Fifteen thousand markings, read in order.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Over 15,000 petroglyphs and 111 stencils run along 160 metres of shelter wall — animal tracks, lines, grooves, drilled holes, and human feet with six toes. The Iningai name for the place is Marra Wonga. It means place of many stories."
      },
      {
        "kind": "paragraph",
        "text": "The wall can be read two ways, and neither is complete without the other. Read as data, it is fifteen thousand individual markings, catalogued and compared by style. Read as law, it is one story, whole, that was never lost."
      },
      {
        "kind": "image",
        "mediaId": "wall-wide"
      },
      {
        "kind": "paragraph",
        "text": "For years, researchers catalogued the ten clusters along the wall as separate designs, made at different times by different hands, using different techniques — pecked, incised, rubbed smooth by hands that returned to the same lines more than once. Cross-referenced against each other, they read as unrelated. It was only when the clusters were walked in the order they actually sit on the rock, south to north, that the separate markings resolved into one continuous account."
      },
      {
        "kind": "image",
        "mediaId": "wall-detail"
      },
      {
        "kind": "pullquote",
        "text": "Read south to north, in sequence, the study confirmed what was already known: the ten clusters tell one story, the Seven Sisters."
      },
      {
        "kind": "paragraph",
        "text": "The sisters pursued. The boomerangs thrown. The Rainbow Serpent. The dingo watching over the one who stayed on Earth. What the study identified as a structural discovery — a single narrative running the length of a rock art site, unmatched anywhere else in the world — was, in Iningai law, the story being told the way it has always been told: in order, one end of the wall to the other, the way a person walks it, the way it has to be walked to be understood at all."
      },
      {
        "kind": "label",
        "text": "In Iningai law"
      },
      {
        "kind": "law",
        "text": "The wall is not a record of the past. It is a record of witnessing — proof kept in stone that someone was here, present, watching, for longer than almost anything else still standing. It isn’t a gallery and it was never finished. It is still being read, the same wall, the same order, generation after generation."
      },
      {
        "kind": "law",
        "text": "Law is carried in stages, the way anything worth knowing is carried. What’s told here is what can be shared with anyone who comes to it with respect. There is more held in the wall than this — kept for those who go further into it, in their own time, on Country, the way it has always been passed down rather than published."
      },
      {
        "kind": "image",
        "mediaId": "footprints"
      },
      {
        "kind": "image",
        "mediaId": "wall-detail"
      },
      {
        "kind": "image",
        "mediaId": "wall-guide"
      },
      {
        "kind": "paragraph",
        "text": "The Seven Sisters are the Pleiades. Their story is told in more than eighty places across this continent, and in cultures on the other side of the world — one of the oldest stories still being told anywhere on Earth, and one of the only constellations visible from both hemispheres."
      },
      {
        "kind": "note",
        "text": "Some of what’s on the wall is common knowledge. Some is women’s, and some is men’s. What’s written here is the part that is told away from Country."
      },
      {
        "kind": "paragraph",
        "text": "The reading was published after a two-year study, carried out with Iningai people as full research partners rather than subjects providing access. It isn’t the last word. A team of astrophysicists is coming next, to work out how the sequence on the wall lines up with the night sky above it — the same partnership, carried into its next chapter. Every study run on Marra Wonga so far has found more structure than the one before it, not less."
      },
      {
        "kind": "paragraph",
        "text": "Read as data, the wall has never been scientifically dated. Based on regional style sequences, the pecked designs are likely more than 5,000 years old; mud wasp nests built over some of the engravings could eventually give a minimum age, if they are ever sampled. The escarpment itself is older again — compressed floor of an inland sea that once reached this far, with fossil footprints and petrified trees still in the rock beneath the engravings."
      },
      {
        "kind": "label",
        "text": "In Iningai law"
      },
      {
        "kind": "law",
        "text": "Long before the current night sky took its shape, before the sea that once lay across this ground had fully withdrawn, this Country was already being watched, and already being marked. The wall reaches back further than any date a study has offered, or is likely to."
      },
      {
        "kind": "image",
        "mediaId": "hand-stencil"
      },
      {
        "kind": "paragraph",
        "text": "Two ways of reading the same stone. Neither one finished it first. Researchers will keep dating what can be dated. Law will keep being carried the way it has always been carried. Marra Wonga has never needed the two accounts to agree in order for both to be true."
      }
    ],
    "sources": [
      {
        "text": "Published as Marra Wonga: Archaeological and contemporary First Nations interpretations of one of central Queensland’s largest rock art sites, Australian Archaeology, 2022."
      },
      {
        "text": "doi.org/10.1080/03122417.2022.2084666",
        "href": "https://doi.org/10.1080/03122417.2022.2084666"
      }
    ]
  },
  "it-nearly-didnt-happen": {
    "title": "It nearly didn't happen",
    "standfirst": "Suzanne Thompson on getting Turraburra back.",
    "sourceDocument": "It nearly didn't happen.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Suzanne was driving out to finish a fence when her phone rang. It was the owner of the land her family had waited years to bring home. He was pulling out, selling because of drought — and just like that, the door was closing."
      },
      {
        "kind": "quote",
        "text": "\"He said, nah, I'm changing that. Now no one's going to get access. I'm shutting the gate.\""
      },
      {
        "kind": "paragraph",
        "text": "She got out of the car. Called out to the old people. And in that moment, everything shifted."
      },
      {
        "kind": "quote",
        "text": "\"I said, no, we've got to buy this place. We can't allow this to happen. What about the grannies?\""
      },
      {
        "kind": "paragraph",
        "text": "She didn't know where to start. She turned to Graham first, then her sister [Cheryl?], and a family connection who could make the first quiet call to the agent [Ed Wood?] — without anyone knowing who was really behind it."
      },
      {
        "kind": "quote",
        "text": "\"We didn't want them to know it was for us. So we had to come in incognito.\""
      },
      {
        "kind": "paragraph",
        "text": "Buying it was only the first hurdle. To actually hold the land, the family had to prove they could look after it — a workshop, a capability statement, everything her mother and sister had built laid out for people to see."
      },
      {
        "kind": "quote",
        "text": "\"By the end of that workshop, when we brought them out here, they were all out here to see it. And then I said to them, we can do this.\""
      },
      {
        "kind": "paragraph",
        "text": "When the offer came, she asked for something more than money."
      },
      {
        "kind": "quote",
        "text": "\"This is going to be a hard journey. But bring my mum on the journey with us. Because we are so fragile.\""
      },
      {
        "kind": "paragraph",
        "text": "On the 30th of April 2019, the last owner drove off the property."
      },
      {
        "kind": "quote",
        "text": "\"And then it was just us. There was Mum. There was Robin Adams. There was Graham. There was me.\""
      },
      {
        "kind": "paragraph",
        "text": "There was no furniture in the house. They slept on the floor that first night."
      },
      {
        "kind": "quote",
        "text": "\"Mark got up and said shh. I said, what? He said, can you hear it? He said, this is ours. And we all got up, yay, and we were dancing around, because we couldn't believe what we'd done.\""
      },
      {
        "kind": "paragraph",
        "text": "Her father runs underneath all of it — a man who spent his life fencing and protecting this Country, and never got to see this day. He died in 2003."
      },
      {
        "kind": "quote",
        "text": "\"My father helped me realise a dream. That was my father's dream.\""
      },
      {
        "kind": "paragraph",
        "text": "Seven years later, the family signed the deed that made it official."
      },
      {
        "kind": "image",
        "mediaId": "deed-signing",
        "caption": "Signing the deed of grant, 12:15pm, Friday 26 June 2026."
      },
      {
        "kind": "quote",
        "text": "\"We will be truly self-determined. But I guarantee, our work starts again from here.\""
      },
      {
        "kind": "note",
        "text": "With thanks to Uncle Winston Forrester, Robin Adams, [Steve?], [Trish?], and everyone else who helped get them here."
      }
    ],
    "sources": []
  },
  "wattanuri-and-the-ones-he-followed": {
    "title": "Wattanuri, and the ones he followed.",
    "standfirst": "The published record, and as much of the rest as is told away from Country.",
    "sourceDocument": "Wattanuri.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "At the southern end of the Marra Wonga shelter is an engraved figure the Iningai know as Wattanuri. Further along the wall, seven star-like markings sit apart from the rest of the engravings, set with care rather than scattered. They are the sisters he never caught."
      },
      {
        "kind": "paragraph",
        "text": "The reading was published in 2022, the result of a study that began in September 2020, led by Professor Paul Taçon of Griffith University’s rock art research unit, working directly with Iningai Traditional Owners. Suzanne Thompson is named as a co-author on the paper itself — not a source interviewed for it, a researcher credited on it."
      },
      {
        "kind": "paragraph",
        "text": "Taçon has pointed out that it’s rare anywhere in the world to have living testimony and formal archaeology aligned this closely. Marra Wonga is one of the few sites left where both still stand together, checked against each other rather than one replacing the other."
      },
      {
        "kind": "pullquote",
        "text": "No other rock art site is known anywhere in the world with a narrative that runs across the entirety of the site."
      },
      {
        "kind": "paragraph",
        "text": "Across Australia, figures like Wattanuri appear again and again in Seven Sisters stories as a Clever Man — someone who can shift shape, becoming a tree, an animal, sometimes a snake, in pursuit of the sisters. On the Marra Wonga wall, a long engraved snake runs north from where the stars end. It’s read two ways: as Wattanuri himself, shifted into another form, or — in some contemporary Iningai readings — as the memory of a creature that no longer exists at all."
      },
      {
        "kind": "paragraph",
        "text": "During fieldwork in 2020, researchers found an eighth star, hidden near the floor at the far end of the wall — not set to be seen from a distance like the other seven, but tucked into a corner, facing the wrong way. Some in the community read it as one of the sisters, still on Earth, hiding from Wattanuri. A dingo track sits just above it. Read together, it looks like the dingo is watching over her."
      },
      {
        "kind": "paragraph",
        "text": "Stories like this one are held in at least eighty-three places across Australia, part of songlines that cross language groups and state borders. In 2017 the National Museum of Australia toured a major exhibition built around them. Marra Wonga’s version isn’t an isolated local story — it’s one documented point on a much older, much larger map."
      },
      {
        "kind": "paragraph",
        "text": "What the chase did along the way is said to have shaped Country still standing today, the same way it shaped the wall — not confined to the rock, but carried in the land itself."
      },
      {
        "kind": "label",
        "text": "In Iningai law"
      },
      {
        "kind": "law",
        "text": "This sits underneath everything else told about Marra Wonga — not because it matters least, but because it is the oldest. Law isn’t dated the way a study is dated. It is the floor everything else has been resting on the whole way down."
      },
      {
        "kind": "note",
        "text": "Some of what’s on the wall is common knowledge. Some is women’s, and some is men’s. What’s written here is only what is told away from Country — the rest is held by the people whose story it is."
      },
      {
        "kind": "paragraph",
        "text": "Wattanuri is still there, at the southern end of the wall. So are the sisters — six of them in plain sight, and a seventh hidden, still watched over. Some stories don’t need an ending written down. They need the wall left standing, and someone left to walk it in order, the way it’s been walked for longer than the wall has ever been dated."
      }
    ],
    "sources": [
      {
        "text": "Taçon, Greenwood, Jalandoni, Thompson et al., “Marra Wonga: Archaeological and contemporary First Nations interpretations of one of central Queensland’s largest rock art sites,” Australian Archaeology, 2022."
      },
      {
        "text": "doi.org/10.1080/03122417.2022.2084666",
        "href": "https://doi.org/10.1080/03122417.2022.2084666"
      }
    ]
  },
  "a-season-of-bush-foods": {
    "title": "A season of bush foods.",
    "standfirst": "What grows here, how we’ve always used it, and what the science is now confirming.",
    "sourceDocument": "YACHATDAC-Article-BushFoods-DRAFT.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Harvesting on Turraburra isn’t run out of a greenhouse. What grows here mostly grows the way it always has, in situ, across the property — permaculture in the oldest sense of the word, not a garden bed."
      },
      {
        "kind": "heading",
        "text": "Native lemongrass — Cymbopogon ambiguus"
      },
      {
        "kind": "paragraph",
        "text": "An aromatic native grass we’ve long used to treat chest infections, headaches, muscle cramps and skin sores — most often as a tea, or inhaled as steam. Research out of Griffith University later found its compounds comparable to aspirin for treating headaches and inflammation."
      },
      {
        "kind": "paragraph",
        "text": "We harvest it directly off the property. One batch went into a small-run gin, a distillery collaboration born from a shared Longreach connection to Qantas — more curiosity than commercial plan."
      },
      {
        "kind": "paragraph",
        "text": "Eight more plants we’ve long used are now part of a formal research panel, run with the Tropical Indigenous Ethnobotany Centre, the Australian Tropical Herbarium and James Cook University."
      },
      {
        "kind": "heading",
        "text": "Gumbi gumbi — Pittosporum angustifolium"
      },
      {
        "kind": "paragraph",
        "text": "Also called native apricot, though we don’t eat the fruit. We traditionally dry the leaves and steep them as a tea, used for coughs, colds and skin complaints."
      },
      {
        "kind": "emphasis",
        "text": "The research panel found real antioxidant and anti-inflammatory activity in the leaf extract — and also found it was the most cytotoxic of the eight to human cells in lab testing. Worth saying plainly, not glossed over."
      },
      {
        "kind": "heading",
        "text": "Quinine berry — Petalostigma pubescens"
      },
      {
        "kind": "paragraph",
        "text": "Small orange fruit we chew for toothache, or infuse as an antiseptic wash for sore eyes. Despite the name, it doesn’t actually contain quinine."
      },
      {
        "kind": "emphasis",
        "text": "What it does contain, in unusually high concentration, is shikimic acid — the compound synthesised into the antiviral drug Tamiflu."
      },
      {
        "kind": "heading",
        "text": "Hop bush — Dodonaea tenuifolia"
      },
      {
        "kind": "paragraph",
        "text": "One of the bush medicines we use most, typically for pain and inflammation. Extract testing found the same alkaloid and flavonoid profile that shows up across most of the eight species in the panel."
      },
      {
        "kind": "heading",
        "text": "Plum bush — Santalum lanceolatum"
      },
      {
        "kind": "paragraph",
        "text": "A relative of the desert quandong, with small edible fruit and a use we’ve long had for the bark and leaf."
      },
      {
        "kind": "heading",
        "text": "Native cotton — Gossypium australe"
      },
      {
        "kind": "paragraph",
        "text": "Better known to us as fibre than food, and less studied than the others on this list — one of the reasons we included it in the research panel rather than assuming what it does."
      },
      {
        "kind": "heading",
        "text": "Velleia macrocalyx"
      },
      {
        "kind": "paragraph",
        "text": "The least documented of the six named species — small, yellow-flowered, part of the same open woodland Country as the rest. Written documentation of it is new. The use isn’t."
      },
      {
        "kind": "heading",
        "text": "And two more"
      },
      {
        "kind": "paragraph",
        "text": "Two of the eight species we gave for testing aren’t named here at all — recorded in the research only by voucher code. That knowledge stays with us."
      },
      {
        "kind": "paragraph",
        "text": "Across the panel, screening confirmed alkaloids, phenolics, flavonoids and terpenoids. Seven of the eight extracts measurably suppressed inflammatory markers in lab testing, with antioxidant activity ranging from moderate to strong."
      },
      {
        "kind": "emphasis",
        "text": "The study’s own conclusion: scientific validation for knowledge we never needed validated."
      }
    ],
    "sources": [
      {
        "text": "Native lemongrass traditional use and Griffith University research via published ethnobotanical sources. Iningai medicinal plant panel: Phytochemical Composition and Antioxidant and Anti-Inflammatory Activities of Iningai Aboriginal Medicinal Plants From Central Queensland, Australia — Tropical Indigenous Ethnobotany Centre, Australian Tropical Herbarium and James Cook University, 2026."
      }
    ]
  },
  "what-the-recorders-hear-at-night": {
    "title": "What the recorders hear at night.",
    "standfirst": "Four acoustic recorders, one national research platform, and a library that’s ours to open or lock away.",
    "sourceDocument": "YACHATDAC-Article-EcoSounds-DRAFT.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Four acoustic recorders sit across the property, two of them at the springs. They run day and night, picking up frogs, birds, and a good deal we haven’t identified yet."
      },
      {
        "kind": "emphasis",
        "text": "Everything they capture goes into a database. We call it the Eco Sounds register."
      },
      {
        "kind": "paragraph",
        "text": "It runs on Ecosounds, the platform QUT’s Ecoacoustics research group built for exactly this — recording, storing and analysing long stretches of environmental audio at a scale no person could sit and listen to in real time. QUT’s own network extends the same idea across the whole continent: solar-powered recorders logging vocal wildlife nationally, because birds, frogs and insects are some of the most reliable indicators of how healthy a piece of Country actually is."
      },
      {
        "kind": "emphasis",
        "text": "We’re one node in that."
      },
      {
        "kind": "paragraph",
        "text": "Not everything gets shared the same way. Some of what the recorders pick up will end up on the website — press play, hear the species. Some of it stays in the research archive, under our own consent terms, because it’s ours before it’s anyone else’s data set."
      },
      {
        "kind": "paragraph",
        "text": "The recorders aren’t the only thing listening and watching. Flux towers elsewhere on the property carry their own cameras, photographing 500 metres of vegetation and flowering through the year, feeding into a separate national climate monitoring network. Different sensors, same principle — Country’s been telling us what’s happening all along. We’re only just building the equipment to keep up."
      },
      {
        "kind": "emphasis",
        "text": "Twelve months of recordings so far. Most of what’s on them still hasn’t been listened to properly."
      }
    ],
    "sources": [
      {
        "text": "Acoustic recording and data access via QUT Ecoacoustics (Ecosounds platform), Queensland University of Technology. Four recorders active on Turraburra, consent and access terms held by YACHATDAC."
      }
    ]
  },
  "fire-stick-farming-and-the-carbon-in-the-soil": {
    "title": "Fire-stick farming and the carbon in the soil.",
    "standfirst": "Two flux towers, side by side. One tells you what grazing does. The other tells you what law does.",
    "sourceDocument": "YACHATDAC-Article-FireCarbon-DRAFT.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "On Turraburra, two flux towers stand on land that looks almost identical from a distance. One sits over paddock grazed the ordinary way. The other sits over Country burned and managed through fire-stick farming, the Iningai way. For more than a year, both have been logging the same things — carbon, moisture, what the ground gives back and what it holds."
      },
      {
        "kind": "emphasis",
        "text": "The two towers don’t always agree."
      },
      {
        "kind": "quote",
        "text": "When we did the soil testing, to go down and check out the soil — thirty centimetres down was where the carbon was starting. So therefore it wasn’t sequestered."
      },
      {
        "kind": "paragraph",
        "text": "Wrong-way fire — a hot burn, run without reading the ground first — leaves carbon sitting deep, doing nothing. Fire-stick farming works differently."
      },
      {
        "kind": "quote",
        "text": "When we do a burn, we look for black ash, which is a biochar in its own right."
      },
      {
        "kind": "emphasis",
        "text": "Within eight or nine months, the paddock had turned into a carbon sink."
      },
      {
        "kind": "paragraph",
        "text": "This isn’t a side project. Suzanne Thompson sits on the Commonwealth’s Emissions Reduction Assurance Committee — the body that assesses and approves the methods used across the entire Australian Carbon Credit Unit scheme, the country’s official carbon market."
      },
      {
        "kind": "emphasis",
        "text": "She’s the committee’s first First Nations member, appointed specifically to help Aboriginal and Torres Strait Islander communities take part in, and benefit from, a market most had been shut out of."
      },
      {
        "kind": "quote",
        "text": "Because this space — them fella, they need our knowledge."
      },
      {
        "kind": "paragraph",
        "text": "Her own framework for it goes further than carbon alone. She calls it Rainbow Carbon — the idea that restoration, biodiversity and cultural knowledge were never separate systems to begin with, and shouldn’t be measured as if they are."
      },
      {
        "kind": "quote",
        "text": "It’s about our holistic land management practice of restoration of nature and sequestering carbon, which creates the unique, integral Indigenous carbon premium credit."
      },
      {
        "kind": "emphasis",
        "text": "Western science can run its own tests alongside it. It usually agrees."
      },
      {
        "kind": "pullquote",
        "text": "Two towers, side by side, logging the same ground. One of them just happens to be standing over land that’s been read correctly for longer."
      }
    ],
    "sources": [
      {
        "text": "Suzanne Thompson, recorded on Country, 2026. Emissions Reduction Assurance Committee appointment confirmed via the Australian Government Department of Climate Change, Energy, the Environment and Water."
      }
    ]
  },
  "gracevale-becomes-turraburra": {
    "title": "Gracevale becomes Turraburra.",
    "standfirst": "The name was written down in 1884. It took over a hundred years, and a buyback, for anyone to use it again.",
    "sourceDocument": "YACHATDAC-Article-Gracevale-DRAFT.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "In 1882, a colonist named George Porter licensed the land as Charlie’s Creek No. 5."
      },
      {
        "kind": "emphasis",
        "text": "That was the first name to appear on paper."
      },
      {
        "kind": "paragraph",
        "text": "Two years later, in 1884, a neighbouring pastoralist named Robert Christison — who had spent two decades building relationships with Dalleburra and Iningai people at his own station further north — recorded the area on a map under a different name entirely: the Terraburra clan’s Country."
      },
      {
        "kind": "emphasis",
        "text": "The right name was already written down. Nobody used it."
      },
      {
        "kind": "paragraph",
        "text": "The station became known as Gracevale instead, and stayed Gracevale for more than a century. Porter’s own son wrote memoirs about growing up on the property."
      },
      {
        "kind": "emphasis",
        "text": "He never once mentioned the wall."
      },
      {
        "kind": "paragraph",
        "text": "Two hundred metres of engravings, on the land his family had held for decades, and no one thought it worth a page."
      },
      {
        "kind": "paragraph",
        "text": "For most of that century, the Iningai people whose Country it was couldn’t visit the site without the property owner’s permission. Cultural heritage across almost nine thousand hectares went formally unrecorded and unstudied — not because there was nothing there, but because nobody who could grant access thought to ask."
      },
      {
        "kind": "pullquote",
        "text": "The right name was on a map before the wrong one was ever spoken. It just took longer to matter."
      },
      {
        "kind": "paragraph",
        "text": "That changed in 2019, when the land was bought back. Within a year, cleared paddocks were under restoration, disused waterways had been reopened, and cattle numbers were down."
      },
      {
        "kind": "emphasis",
        "text": "On the 1st of October, 2020, Gracevale was renamed and reopened as Turraburra — the name Christison had written down 136 years earlier."
      },
      {
        "kind": "paragraph",
        "text": "At the reopening, Suzanne Thompson described the wall as “the university teaching wall of our songlines.” Not a discovery. A return."
      },
      {
        "kind": "paragraph",
        "text": "Charlie’s Creek No. 5 lasted 138 years on paper."
      },
      {
        "kind": "emphasis",
        "text": "Terraburra was only ever missing from use."
      }
    ],
    "sources": [
      {
        "text": "Christison and the 1884 map via Smith (1994) and Taçon et al., Australian Archaeology, 2022. Reopening detail from ABC News, October 2020, and the Indigenous Land and Sea Corporation project record."
      }
    ]
  },
  "what-mitchell-wrote-down": {
    "title": "What Mitchell wrote down.",
    "standfirst": "The oldest written account of this Country was made by a stranger passing through, in a hurry, looking for something else entirely.",
    "sourceDocument": "YACHATDAC-Article-Mitchell-DRAFT (2).docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "In September 1846, the explorer Thomas Mitchell reached the edge of what is now Iningai Country, nearly at the end of a four-month search for a river route to the north. His fourth expedition had left Sydney the previous December with twenty-nine men, bullock drays, and two iron boats built to bolt together — all of it in search of a great river that didn’t exist."
      },
      {
        "kind": "emphasis",
        "text": "He never found it."
      },
      {
        "kind": "paragraph",
        "text": "What he found instead, and wrote down almost in passing, is the oldest written record of the people who were already here."
      },
      {
        "kind": "paragraph",
        "text": "He liked the Country more than he expected to. Struggling on despite a packhorse too sore-backed to carry its load, he described the plains here as the finest region he’d seen in Australia."
      },
      {
        "kind": "emphasis",
        "text": "He named the river running through it the Victoria, after the Queen."
      },
      {
        "kind": "paragraph",
        "text": "It’s called the Barcoo now, and has been for a long time — his name didn’t outlast the season."
      },
      {
        "kind": "paragraph",
        "text": "On the 20th of September, following the riverbank after it had finally settled into a straight, steady course, Mitchell came upon a group of Iningai huts. He wrote that they were of “more substantial construction … than usually set up by the aborigines of the south.” Each had a timber frame under a lean-to roof, rafters laid across it, and thin square portions of bark fitted over the top like tiles — built for weather, not for a single night."
      },
      {
        "kind": "emphasis",
        "text": "Five days later, he found out how many people that Country actually held."
      },
      {
        "kind": "paragraph",
        "text": "On the 25th, following a large tributary, the party came on a lagoon ringed with huts — a large, recently occupied camp, with well-beaten paths between them. Women and children were bathing and digging for mussels when they were spotted. The shouting started before Mitchell could raise the green bough he carried as a sign of peace. “Aya minyà!” the men called, over and over — what do you want. One carried an iron tomahawk on a long handle, held up and glinting."
      },
      {
        "kind": "quote",
        "text": "“Our position,” Mitchell wrote, “was anything but enviable.”"
      },
      {
        "kind": "paragraph",
        "text": "His own Aboriginal guide, Yuranigh, brought from Country far to the south, couldn’t understand a word the Iningai men were shouting. Mitchell held his men in line and gave no sign of aggression; the party was allowed to pass, the shouting fading slowly behind them as they walked on."
      },
      {
        "kind": "pullquote",
        "text": "The first written account of the people here was made by someone who had just arrived. Everyone who could have written it earlier had no reason to."
      },
      {
        "kind": "paragraph",
        "text": "Mitchell wasn’t looking for a record of settlement. He was looking for a river to the coast, and running low on both patience and supplies. What he wrote down anyway — permanent shelters, worn paths, a camp large enough to unsettle an armed party — describes a Country that had been lived in, in one place, for long enough to leave marks like that, in numbers his own guide had no word for."
      },
      {
        "kind": "emphasis",
        "text": "He didn’t draw the conclusion. The huts, and the shouting, did."
      }
    ],
    "sources": [
      {
        "text": "Mitchell, T.L., Journal of an Expedition into the Interior of Tropical Australia (1848), entries of 20 and 25 September 1846. Place identification (Iningai Country, near present-day Barcaldine) via local historical records; additional detail via Taçon et al., Australian Archaeology, 2022."
      }
    ]
  },
  "pollen-at-sixty-metres": {
    "title": "Pollen at sixty metres.",
    "standfirst": "A water bore went 480 metres down. What came up on the way is still being read.",
    "sourceDocument": "YACHATDAC-Article-Pollen-DRAFT.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "We drilled at Lancewood Ridge — the oldest land type on the property — looking for water. Four hundred and eighty metres down before we hit it."
      },
      {
        "kind": "emphasis",
        "text": "We asked the drillers to keep a soil sample every six metres on the way."
      },
      {
        "kind": "paragraph",
        "text": "That’s eighty samples, from a hole we were paying to make anyway. The cost of asking for them was close to nothing."
      },
      {
        "kind": "paragraph",
        "text": "Pollen buried in sediment layers is one of the main ways scientists reconstruct what a landscape looked like before anyone was there to write it down — what grew, when the climate shifted, how the ground changed underneath it. In a region where age itself is hard to pin down, a pollen record from underground is sometimes the only clock available."
      },
      {
        "kind": "emphasis",
        "text": "Sixty metres down, there was pollen."
      },
      {
        "kind": "paragraph",
        "text": "The samples went to QUT."
      },
      {
        "kind": "emphasis",
        "text": "They’re still being read."
      },
      {
        "kind": "paragraph",
        "text": "This isn’t a research programme we built from scratch. It’s a habit: don’t let a hole in the ground go to waste. Every bore is a core sample nobody else will ever get the chance to take — the ground only gets disturbed once."
      },
      {
        "kind": "pullquote",
        "text": "You’re paying to make the hole either way. The ground you bring up is a record nobody else has."
      },
      {
        "kind": "paragraph",
        "text": "The depth is known. The interval is known."
      },
      {
        "kind": "emphasis",
        "text": "What the pollen actually says about this Country’s past is still being worked out — and when it is, this page gets rewritten, not written over."
      }
    ],
    "sources": [
      {
        "text": "Field record held with Queensland University of Technology (QUT). 480m depth, 6m sample interval, pollen confirmed at 60m. Analysis ongoing."
      }
    ]
  },
  "bringing-a-spring-back": {
    "title": "Bringing a spring back.",
    "standfirst": "A thousand litres, twice a day, for eight days. Then a koala came to drink.",
    "sourceDocument": "YACHATDAC-Article-Spring-DRAFT.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "This is a super spring area — water welling up from an underground system so wide it drains through multiple artesian basins, some sitting on top of ancient riverbeds, each one chemically different from the next. QUT is out here now, testing what makes each spring behave the way it does."
      },
      {
        "kind": "emphasis",
        "text": "One of them had gone dry."
      },
      {
        "kind": "quote",
        "text": "We cleaned the water hole out. And when we cleaned it out, we went down and planted grasses, and we went down twice a day and watered it — a thousand litres of water, twice a day, because we’re in drought. Because we rainmake."
      },
      {
        "kind": "paragraph",
        "text": "Eight days of carting water to a hole that wasn’t holding any of it."
      },
      {
        "kind": "quote",
        "text": "And then after the eight days in, it held a puddle of water."
      },
      {
        "kind": "emphasis",
        "text": "We came the next morning, and there was a koala."
      },
      {
        "kind": "paragraph",
        "text": "In her own colour-coded system for reading Country — the same one that gives cultural burning its place on the spectrum — spring restoration gets its own colour too."
      },
      {
        "kind": "emphasis",
        "text": "Turquoise."
      },
      {
        "kind": "paragraph",
        "text": "It isn’t an isolated fix. Across the property, new springs have started appearing after heavy rain — the water table resetting itself, decades of pressure finding new places to surface. What happened at this one hole is small only if you don’t know what it’s connected to."
      },
      {
        "kind": "emphasis",
        "text": "Underground, it’s all one system. It just needed someone to notice which part was thirsty."
      }
    ],
    "sources": [
      {
        "text": "Suzanne Thompson, recorded on Country, 2026. Spring hydrology detail from on-Country accounts and ongoing research with Queensland University of Technology."
      }
    ]
  },
  "you-are-standing-on-a-seabed": {
    "title": "You are standing on a seabed",
    "standfirst": "The ground under Turraburra was the floor of an inland sea long before it was anything else.",
    "sourceDocument": "You are standing on a seabed.docx.pdf",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "During the Cretaceous, a shallow inland sea called the Eromanga Sea spread across most of western Queensland, flooding the region at least five separate times over tens of millions of years. By around 95 million years ago it had withdrawn for good, leaving behind the sand, silt and clay that would become the Winton Formation — one of the richest sources of dinosaur fossils anywhere in Australia."
      },
      {
        "kind": "paragraph",
        "text": "Stand on the escarpment here and the old shoreline is almost readable in the ground itself. The property holds at least six distinct soil profiles — red clay, pale grey sand, and white sand pale enough to still carry shell fragments — laid down as the coastline here advanced and retreated over deep time. Along its edges, where the sea would have met a fringe of prehistoric mangroves, mud set hard enough to keep footprints. Some of them are still here."
      },
      {
        "kind": "pullquote",
        "text": "Petrified trees stand in the same ground. One visiting specialist has suggested a scatter of rounded stone nearby may be fossil dinosaur eggs. Nothing has been formally confirmed — the land hasn’t finished being read yet."
      },
      {
        "kind": "paragraph",
        "text": "The best-known resident of this old shoreline lived about a hundred kilometres from here, on the same Iningai and Bidjara Country. In 1963, a grazier named Doug Langdon was mustering cattle near Muttaburra when he found the bones of a seven-metre plant-eater with an unusually large, domed snout. Described in 1981, Muttaburrasaurus langdoni is one of the most complete dinosaur skeletons ever found in Australia, and in 2023 it was made Queensland’s official fossil emblem."
      },
      {
        "kind": "paragraph",
        "text": "The record is still growing. In 2026, a palaeontologist relocated the original 1963 site and recovered another 1,300 bone fragments from the ground — enough to show the dinosaur likely carried teeth at the very tip of its snout, something no one had expected of it."
      },
      {
        "kind": "paragraph",
        "text": "The same sea that shaped this Country also carried plesiosaurs — long-necked marine reptiles up to ten metres long. Some of the most complete examples found anywhere in the world have turned up on outback cattle properties not far from here, discovered by graziers rather than expeditions. Whatever swam past this shoreline is still, mostly, underground."
      },
      {
        "kind": "paragraph",
        "text": "The escarpment above Marra Wonga is younger than all of it. Before anyone marked the wall, this ground was already a hundred million years into its own story."
      }
    ],
    "sources": [
      {
        "text": "Geological and fossil detail drawn from the Queensland Museum, the University of Queensland Dinosaur Lab, and Queensland Government records on the Winton Formation and Muttaburrasaurus langdoni. Property soil and footprint detail from Tilly’s on-Country account."
      }
    ]
  }
};
