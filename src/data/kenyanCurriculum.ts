import { GradeLevel, SubjectCurriculum } from '../types';

export const GRADES_LIST: GradeLevel[] = [
  'PP1',
  'PP2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'KCSE Revision',
];

export const CURRICULUM_DATABASE: Record<GradeLevel, SubjectCurriculum[]> = {
  'PP1': [
    {
      name: 'Mathematical Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'Classification',
          subStrands: ['Sorting and Grouping objects by color', 'Matching items', 'Ordering by size'],
          sampleOutcomes: 'By the end of the sub-strand, the learner should be able to sort and group real objects according to color.',
          sampleQuestions: 'How do we sort objects of different colors?'
        },
        {
          strand: 'Number Concepts',
          subStrands: ['Counting numbers 1-9', 'Rote counting', 'One-to-one correspondence'],
          sampleOutcomes: 'By the end of the sub-strand, the learner should be able to count objects up to 9 with accuracy.',
          sampleQuestions: 'How many bottle tops are on the table?'
        }
      ]
    },
    {
      name: 'Language Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'Listening and Speaking',
          subStrands: ['Greetings and Farewell', 'Self-expression', 'Listening to short stories'],
          sampleOutcomes: 'By the end of the lesson, the learner should respond courteously to greetings in everyday situations.',
          sampleQuestions: 'What do you say when someone says good morning?'
        },
        {
          strand: 'Pre-Reading and Writing',
          subStrands: ['Book handling habits', 'Left-to-right eye movement', 'Scribbling and doodling'],
          sampleOutcomes: 'Demonstrate proper book handling and scribble strokes from left to right.',
          sampleQuestions: 'How do we open a storybook without tearing pages?'
        }
      ]
    },
    {
      name: 'Environmental Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'My School & Myself',
          subStrands: ['Body parts and hygiene', 'School environment', 'Cleanliness and washing hands'],
          sampleOutcomes: 'Identify external parts of the body and demonstrate correct handwashing steps with clean water and soap.',
          sampleQuestions: 'Why do we wash our hands before eating?'
        }
      ]
    },
    {
      name: 'Psychomotor and Creative Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'Art and Craft',
          subStrands: ['Finger painting', 'Pattern making', 'Clay modeling of simple shapes'],
          sampleOutcomes: 'Model simple balls and rings using natural modeling clay or playdough.',
          sampleQuestions: 'What items can you make with clay?'
        }
      ]
    }
  ],

  'PP2': [
    {
      name: 'Mathematical Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'Numbers',
          subStrands: ['Number recognition 1-20', 'Addition with concrete objects', 'Measurement: heavy and light'],
          sampleOutcomes: 'Recognize numerals 1-20 and combine groups of objects up to 10.',
          sampleQuestions: 'What is 3 stones and 2 stones combined?'
        },
        {
          strand: 'Geometry & Shapes',
          subStrands: ['Circles, Triangles, Rectangles', 'Pattern identification'],
          sampleOutcomes: 'Identify and name geometric shapes found in the immediate classroom environment.',
          sampleQuestions: 'What shape looks like the classroom door?'
        }
      ]
    },
    {
      name: 'Language Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'Phonics & Reading Readiness',
          subStrands: ['Letter sounds a-z', 'Word building (2-3 letter words)', 'Picture reading'],
          sampleOutcomes: 'Pronounce letter sounds correctly and blend letters to form simple words like cat, mat, sun.',
          sampleQuestions: 'What sound does letter S make?'
        }
      ]
    },
    {
      name: 'Environmental Activities',
      category: 'Early Years',
      topics: [
        {
          strand: 'Weather & Safety',
          subStrands: ['Sunny, Rainy, Windy days', 'Road safety basics', 'Stranger awareness'],
          sampleOutcomes: 'Identify safe road-crossing practices and recognize basic weather symbols.',
          sampleQuestions: 'What clothes do we wear on a rainy day?'
        }
      ]
    }
  ],

  'Grade 1': [
    {
      name: 'Mathematics Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Numbers',
          subStrands: ['Number concept (1-50)', 'Place Value (Tens and Ones)', 'Addition and Subtraction within 20'],
          sampleOutcomes: 'Represent two-digit numbers up to 50 using bundles of sticks for tens and loose ones.',
          sampleQuestions: 'How do you represent number 24 using sticks?'
        },
        {
          strand: 'Measurement',
          subStrands: ['Length comparison (longer/shorter)', 'Mass comparison', 'Kenyan Currency (1, 5, 10, 20 coins)'],
          sampleOutcomes: 'Identify Kenyan coins and use them in simulated shopping activities in class.',
          sampleQuestions: 'How much change will you get from a 10 shilling coin when you buy a pencil of 5 shillings?'
        }
      ]
    },
    {
      name: 'English Language Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Listening and Speaking',
          subStrands: ['Theme: Family', 'Polite language (Excuse me, Thank you)', 'Oral narratives'],
          sampleOutcomes: 'Use polite language appropriately in everyday conversational contexts.',
          sampleQuestions: 'When should we say excuse me?'
        },
        {
          strand: 'Reading',
          subStrands: ['Sight words', 'Decodable texts', 'Comprehension of simple stories'],
          sampleOutcomes: 'Read simple decodable sentences with fluency and appropriate intonation.',
          sampleQuestions: 'Who went to the market in the story?'
        }
      ]
    },
    {
      name: 'Kiswahili Language Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Kusikiliza na Kuzungumza',
          subStrands: ['Salamu na Maagano', 'Mimi na Familia Yangu', 'Rangi mbalimbali'],
          sampleOutcomes: 'Kutambua na kutumia salamu sahihi asubuhi, mchana na jioni.',
          sampleQuestions: 'Unamsalimiaje mwalimu wako asubuhi?'
        }
      ]
    },
    {
      name: 'Hygiene and Nutrition',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Health Practices',
          subStrands: ['Oral hygiene (teeth brushing)', 'Common illnesses in our area', 'Safe drinking water'],
          sampleOutcomes: 'Demonstrate the correct technique of brushing teeth using local toothbrush (mswaki) or conventional brush.',
          sampleQuestions: 'Why must we boil or treat drinking water?'
        }
      ]
    }
  ],

  'Grade 2': [
    {
      name: 'Mathematics Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Numbers',
          subStrands: ['Numbers up to 100', 'Addition with regrouping', 'Subtraction without borrowing', 'Fractions: 1/2 and 1/4'],
          sampleOutcomes: 'Identify halves and quarters of whole concrete items like oranges and paper cut-outs.',
          sampleQuestions: 'If you cut a loaf of bread into two equal pieces, what is each piece called?'
        }
      ]
    },
    {
      name: 'English Language Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Reading and Writing',
          subStrands: ['Nouns and Pronouns', 'Punctuation: Capital letters and Full stops', 'Short paragraph composition'],
          sampleOutcomes: 'Write four simple sentences about My Pet using capital letters and full stops accurately.',
          sampleQuestions: 'Where do we place a capital letter in a sentence?'
        }
      ]
    },
    {
      name: 'Environmental Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Soil and Plants',
          subStrands: ['Types of soil (Clay, Sand, Loam)', 'Parts of a plant', 'Care for trees'],
          sampleOutcomes: 'Distinguish loam, clay and sand soil by texture and touch.',
          sampleQuestions: 'Which soil holds water best for modeling?'
        }
      ]
    }
  ],

  'Grade 3': [
    {
      name: 'Mathematics Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Numbers & Operations',
          subStrands: ['Numbers up to 1000', 'Multiplication as repeated addition', 'Division as equal sharing', 'Fractions: 1/2, 1/4, 1/8'],
          sampleOutcomes: 'Multiply single digit numbers by 2, 3, 4, 5, and 10 using practical grouping.',
          sampleQuestions: 'How can we write 4 groups of 3 using multiplication?'
        }
      ]
    },
    {
      name: 'Movement and Creative Activities',
      category: 'Lower Primary',
      topics: [
        {
          strand: 'Indigenous Crafts & Music',
          subStrands: ['Weaving with local banana fibres', 'Kenyan folk songs', 'Percussion instruments (Kayamba)'],
          sampleOutcomes: 'Play rhythm patterns on a kayamba or shakers to accompany traditional Kenyan songs.',
          sampleQuestions: 'What materials are used to make a kayamba?'
        }
      ]
    }
  ],

  'Grade 4': [
    {
      name: 'Science and Technology',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Living Things',
          subStrands: ['Characteristics of living things', 'Vertebrates and Invertebrates', 'The Digestive System basics'],
          sampleOutcomes: 'Identify main organs of human digestive system and their functions in digestion.',
          sampleQuestions: 'What is the role of saliva in digestion?'
        },
        {
          strand: 'Matter & Computing',
          subStrands: ['Solid, Liquid, Gas', 'Introduction to Digital Devices (tablets/laptops)', 'Safety online'],
          sampleOutcomes: 'Categorize local materials into solids, liquids and gases based on definite shape and volume.',
          sampleQuestions: 'Why does water take the shape of its container?'
        }
      ]
    },
    {
      name: 'Social Studies',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Physical Environment',
          subStrands: ['Compass directions (4 cardinal points)', 'Physical features of our County', 'Weather instruments'],
          sampleOutcomes: 'Use a four-point compass to locate features within the county.',
          sampleQuestions: 'Which direction does the sun rise from?'
        }
      ]
    },
    {
      name: 'Agriculture and Nutrition',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Crop Production',
          subStrands: ['Soil recovery and conservation', 'Kitchen garden establishment', 'Compost manure making'],
          sampleOutcomes: 'Prepare a sack garden or container garden for growing indigenous vegetables at home or school.',
          sampleQuestions: 'Why are container gardens suitable for homes with limited land?'
        }
      ]
    }
  ],

  'Grade 5': [
    {
      name: 'Mathematics',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Numbers',
          subStrands: ['Numbers up to 1,000,000', 'Divisibility test for 2, 3, 5, 10', 'Decimals and Percentages'],
          sampleOutcomes: 'Apply divisibility tests to determine factors of numbers without long division.',
          sampleQuestions: 'How do you know if a number is divisible by 5?'
        }
      ]
    },
    {
      name: 'Science and Technology',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Environment and Energy',
          subStrands: ['Water pollution and purification', 'Sound energy and transmission', 'Circulatory system basics'],
          sampleOutcomes: 'Demonstrate filtration and boiling as simple methods of purifying contaminated water.',
          sampleQuestions: 'How does sound travel from a drum to our ears?'
        }
      ]
    }
  ],

  'Grade 6': [
    {
      name: 'Mathematics (KPSEA Prep)',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Measurement & Algebra',
          subStrands: ['Area of triangles and quadrilaterals', 'Volume of cubes and cuboids', 'Simple algebraic equations'],
          sampleOutcomes: 'Calculate surface area and volume of regular solids in real-life problem solving.',
          sampleQuestions: 'How many cubic centimeters are in a rectangular tank of length 10cm, width 5cm, height 4cm?'
        }
      ]
    },
    {
      name: 'Integrated Science (KPSEA Focus)',
      category: 'Upper Primary',
      topics: [
        {
          strand: 'Light & Electricity',
          subStrands: ['Refraction of light', 'Simple electric circuits', 'Renewable solar energy'],
          sampleOutcomes: 'Construct a simple working series circuit using cells, switch, wires and a bulb.',
          sampleQuestions: 'What happens to the bulb when the switch is opened?'
        }
      ]
    }
  ],

  'Grade 7': [
    {
      name: 'Integrated Science',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Scientific Investigation',
          subStrands: ['Laboratory apparatus and safety rules', 'SI units of measurement', 'Separation of mixtures (Decantation, Filtration, Evaporation)'],
          sampleOutcomes: 'State laboratory safety regulations and handle apparatus including Bunsen burner and measuring cylinder correctly.',
          sampleQuestions: 'How do you light and adjust a Bunsen burner safely?'
        },
        {
          strand: 'Living Things and Ecology',
          subStrands: ['Cell biology (Plant & Animal cell under microscope)', 'Human reproductive system', 'Ecosystems in Kenya'],
          sampleOutcomes: 'Mount and view onion epidermal cells under light microscope and identify the cell wall, nucleus and cytoplasm.',
          sampleQuestions: 'Why does a plant cell have a cell wall while an animal cell does not?'
        }
      ]
    },
    {
      name: 'Pre-Technical Studies',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Materials & Safety',
          subStrands: ['Workshop safety and PPE', 'Metallic and Non-metallic materials', 'Technical drawing: Lines and Angles'],
          sampleOutcomes: 'Construct right angles, parallel lines, and bisect given angles using a compass and straightedge.',
          sampleQuestions: 'Why are safety goggles mandatory when grinding or welding?'
        }
      ]
    },
    {
      name: 'Social Studies',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'African Heritage & Geography',
          subStrands: ['Map reading & Grid references', 'Early human fossils in East Africa (Olduvai, Turkana)', 'Kenyan Constitution 2010 Structure'],
          sampleOutcomes: 'Locate features on a topographical map using four-figure and six-figure grid references.',
          sampleQuestions: 'Why is Kenya referred to as the cradle of mankind?'
        }
      ]
    },
    {
      name: 'Mathematics',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Numbers & Algebra',
          subStrands: ['Integers (Positive & Negative arithmetic)', 'Fractions, Decimals & Recurring decimals', 'Linear equations in one unknown'],
          sampleOutcomes: 'Solve real-life word problems involving directed numbers and linear equations.',
          sampleQuestions: 'If 3x + 15 = 45, what is the value of x?'
        }
      ]
    }
  ],

  'Grade 8': [
    {
      name: 'Integrated Science',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Matter & Chemical Reactions',
          subStrands: ['Atomic structure (Protons, Neutrons, Electrons)', 'Periodic table first 20 elements', 'Acids, Bases & Indicators'],
          sampleOutcomes: 'Write electronic configurations for elements with atomic numbers 1 to 20 and explain chemical stability.',
          sampleQuestions: 'Why do noble gases not readily form chemical bonds?'
        },
        {
          strand: 'Energy and Motion',
          subStrands: ['Force and types of forces', 'Pressure in solids and liquids', 'Heat transfer (Conduction, Convection, Radiation)'],
          sampleOutcomes: 'Explain how atmospheric pressure is demonstrated in drinking straws, siphons and syringes.',
          sampleQuestions: 'Why does atmospheric pressure decrease with increasing altitude?'
        }
      ]
    },
    {
      name: 'Pre-Technical Studies',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Drawing & Woodwork',
          subStrands: ['Isometric and Oblique pictorial drawing', 'Hand tools for woodwork (Saws, Planes, Chisels)', 'Wood joints (Mortise & Tenon, Halving)'],
          sampleOutcomes: 'Draw an isometric projection of a simple block from given orthographic views.',
          sampleQuestions: 'What is the angle of projection for isometric axes?'
        }
      ]
    },
    {
      name: 'Agriculture & Nutrition',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Crop & Animal Management',
          subStrands: ['Soil fertility & organic composting', 'Poultry rearing (broilers & layers)', 'Food preservation techniques (drying, smoking, freezing)'],
          sampleOutcomes: 'Outline the daily management practices in broiler poultry rearing including brooding and vaccination.',
          sampleQuestions: 'What symptoms indicate Newcastle disease in poultry?'
        }
      ]
    }
  ],

  'Grade 9': [
    {
      name: 'Integrated Science (CBE Assessment Ready)',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Genetics & Evolution Basics',
          subStrands: ['Inheritance and variations', 'Natural selection overview', 'Electromagnetism & electric motors'],
          sampleOutcomes: 'Differentiate between continuous and discontinuous variation with relatable human examples.',
          sampleQuestions: 'Why is blood group an example of discontinuous variation?'
        }
      ]
    },
    {
      name: 'Mathematics',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Geometry & Statistics',
          subStrands: ['Pythagoras Theorem & Trigonometry', 'Circle geometry (Tangents & Chords)', 'Measures of central tendency (Mean, Median, Mode)'],
          sampleOutcomes: 'Calculate unknown sides and angles of right-angled triangles using sine, cosine and tangent ratios.',
          sampleQuestions: 'How can trigonometry be used to find the height of a flagpole without climbing it?'
        }
      ]
    },
    {
      name: 'Creative Arts & Sports',
      category: 'Junior Secondary',
      topics: [
        {
          strand: 'Performing Arts & Entrepreneurship',
          subStrands: ['Playwriting & staging', 'Music production fundamentals', 'Sports refereeing and ethics'],
          sampleOutcomes: 'Analyze characterization and stage directions in a dramatic performance script.',
          sampleQuestions: 'How do stage directions communicate mood and movement?'
        }
      ]
    }
  ],

  'Grade 10': [
    {
      name: 'Mathematics',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Algebra and Functions',
          subStrands: ['Quadratic expressions and equations', 'Indices and Logarithms', 'Simultaneous linear and quadratic equations'],
          sampleOutcomes: 'Solve quadratic equations using factorization, completing the square and the quadratic formula.',
          sampleQuestions: 'When is the quadratic formula preferred over factorization?'
        }
      ]
    },
    {
      name: 'Biology',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Cell Physiology & Nutrition',
          subStrands: ['Diffusion, Osmosis, Active Transport', 'Photosynthesis (Light & Dark stages)', 'Enzyme properties and kinetics'],
          sampleOutcomes: 'Investigate effect of temperature and pH on salivary amylase activity in a laboratory setting.',
          sampleQuestions: 'Why are enzymes denatured at temperatures above 45 degrees Celsius?'
        }
      ]
    },
    {
      name: 'Chemistry',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Structure and Bonding',
          subStrands: ['Covalent, Ionic, Metallic bonding', 'Trends in the periodic table (Atomic radius, Ionization energy)', 'The Mole Concept fundamentals'],
          sampleOutcomes: 'Calculate empirical and molecular formulas of compounds from percentage composition data.',
          sampleQuestions: 'What is Avogadro’s constant and its significance in chemical equations?'
        }
      ]
    },
    {
      name: 'Physics',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Mechanics',
          subStrands: ['Linear motion (Velocity, Acceleration, Equations of motion)', 'Newton’s Laws of Motion', 'Moments of a Force and Equilibrium'],
          sampleOutcomes: 'Derive and apply equations of uniformly accelerated motion to solve projectile and vehicle braking problems.',
          sampleQuestions: 'Why must passengers wear seatbelts according to Newton’s First Law?'
        }
      ]
    }
  ],

  'Grade 11': [
    {
      name: 'Mathematics Alt A',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Calculus & Vectors',
          subStrands: ['Differentiation from first principles', 'Equations of tangents and normals', 'Vectors in three dimensions (3D)'],
          sampleOutcomes: 'Find derivative of polynomial functions and determine stationary points and their nature.',
          sampleQuestions: 'How do you determine whether a turning point is a local maximum or minimum?'
        }
      ]
    },
    {
      name: 'Chemistry',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Organic Chemistry I & Thermochemistry',
          subStrands: ['Alkanes, Alkenes, Alkynes nomenclature', 'Fractional distillation of petroleum', 'Enthalpy changes of neutralization and combustion'],
          sampleOutcomes: 'Draw structural isomers of alkanes with up to six carbon atoms and name them using IUPAC nomenclature.',
          sampleQuestions: 'What makes cracking of heavy petroleum fractions economically vital?'
        }
      ]
    },
    {
      name: 'English & Literature',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Literature in English (Set Books)',
          subStrands: ['Novel character analysis and themes', 'Drama and stylistic devices', 'Poetry appreciation and rhyme schemes'],
          sampleOutcomes: 'Analyze thematic concerns such as integrity, governance, and gender relations in Kenyan approved set texts.',
          sampleQuestions: 'How does the playwright use dramatic irony to build suspense?'
        }
      ]
    }
  ],

  'Grade 12': [
    {
      name: 'Mathematics',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Integral Calculus & Probability',
          subStrands: ['Definite and indefinite integrals', 'Area under a curve', 'Tree diagrams & mutually exclusive events'],
          sampleOutcomes: 'Calculate area bounded by a polynomial curve, x-axis and given ordinates using integration.',
          sampleQuestions: 'What is the relationship between differentiation and integration?'
        }
      ]
    },
    {
      name: 'Physics',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'Electromagnetism & Electronics',
          subStrands: ['Faraday’s and Lenz’s laws of induction', 'Transformers and national power grid', 'Photoelectric effect and Einstein’s equation'],
          sampleOutcomes: 'Explain working principles of step-up and step-down transformers and power transmission at high voltage.',
          sampleQuestions: 'Why is electrical energy transmitted at very high voltage over long national distances?'
        }
      ]
    },
    {
      name: 'History and Government',
      category: 'Senior Secondary',
      topics: [
        {
          strand: 'National Unity & Devolution in Kenya',
          subStrands: ['The 2010 Kenyan Constitution chapters', 'Devolved governance (County Governments)', 'Electoral process and IEBC responsibilities'],
          sampleOutcomes: 'Examine roles and challenges faced by county governments under devolution in Kenya.',
          sampleQuestions: 'What are the checks and balances between County Executive and County Assembly?'
        }
      ]
    }
  ],

  'KCSE Revision': [
    {
      name: 'Mathematics Paper 1 & 2 Revision',
      category: 'National Examination Prep',
      topics: [
        {
          strand: 'Topical High-Yield KCSE Questions',
          subStrands: ['Commercial Arithmetic & Taxation (PAYE)', 'Matrices and Transformations', 'Trigonometry & 3D Geometry', 'Probability & Statistics'],
          sampleOutcomes: 'Master KNEC marking scheme conventions for Section I (50 marks) and Section II (50 marks) calculations.',
          sampleQuestions: 'Calculate taxable income and net tax payable given personal relief of Ksh. 2,400 per month.'
        }
      ]
    },
    {
      name: 'English Paper 1, 2 & 3 Revision',
      category: 'National Examination Prep',
      topics: [
        {
          strand: 'Functional Writing & Literary Analysis',
          subStrands: ['Functional writing (Curriculum Vitae, Minutes, Reports)', 'Excerpts and comprehension mastery', 'Essay writing on approved KNEC set books'],
          sampleOutcomes: 'Format formal minutes, memorandum and CV according to KNEC English Paper 1 marking scheme rubrics.',
          sampleQuestions: 'Write the minutes of the Drama Club meeting discussing preparations for the National Drama Festival.'
        }
      ]
    },
    {
      name: 'Biology Paper 1, 2 & 3 (Practicals)',
      category: 'National Examination Prep',
      topics: [
        {
          strand: 'KCSE Practical Investigation & Diagrams',
          subStrands: ['Food tests (Starch, Reducing sugars, Proteins, Lipids)', 'Microscope magnification calculations', 'Ecology and physiological adaptations'],
          sampleOutcomes: 'Record experimental observations and accurate deduction tables for unknown food solution tests.',
          sampleQuestions: 'Explain the color changes observed when Benedict’s solution is heated with reducing sugars.'
        }
      ]
    },
    {
      name: 'Chemistry Paper 1, 2 & 3 (Qualitative Analysis)',
      category: 'National Examination Prep',
      topics: [
        {
          strand: 'Volumetric & Qualitative Analysis',
          subStrands: ['Titration calculations (Molarity, Mol, Mass)', 'Cation and Anion identification tests', 'Energy changes & Organic conversion pathways'],
          sampleOutcomes: 'Tabulate titration results with concordant titres and calculate exact concentration in moles per litre.',
          sampleQuestions: 'How do you confirm the presence of sulfate ions in an unknown salt solution?'
        }
      ]
    }
  ]
};

export const KENYAN_OFFICIAL_CALENDAR_2026 = [
  {
    id: 'cal-1',
    title: 'Term 1 Opening (sample date)',
    date: '2026-01-05',
    category: 'term_start' as const,
    term: 1,
    description: 'Schools open for Term 1 (13 Weeks Duration) across Pre-Primary, Primary, and Secondary.'
  },
  {
    id: 'cal-2',
    title: 'Term 1 Mid-Term / Half Term Break',
    date: '2026-02-18',
    endDate: '2026-02-22',
    category: 'half_term' as const,
    term: 1,
    description: 'National 3-day half-term break for all primary and secondary schools.'
  },
  {
    id: 'cal-3',
    title: 'Term 1 Closing Date',
    date: '2026-04-03',
    category: 'closing' as const,
    term: 1,
    description: 'Term 1 ends. 3-week holiday begins.'
  },
  {
    id: 'cal-4',
    title: 'Term 2 Opening (sample date)',
    date: '2026-04-27',
    category: 'term_start' as const,
    term: 2,
    description: 'Schools open for Term 2 (14 Weeks Duration).'
  },
  {
    id: 'cal-5',
    title: 'Term 2 Half Term Break',
    date: '2026-06-17',
    endDate: '2026-06-21',
    category: 'half_term' as const,
    term: 2,
    description: 'Mid-term break across all schools.'
  },
  {
    id: 'cal-6',
    title: 'Term 2 Closing Date',
    date: '2026-07-31',
    category: 'closing' as const,
    term: 2,
    description: 'Term 2 ends. 3-week August holiday begins.'
  },
  {
    id: 'cal-7',
    title: 'Term 3 Opening & National Exam Term',
    date: '2026-08-24',
    category: 'term_start' as const,
    term: 3,
    description: 'Schools open for short 9-week term focused on KPSEA and KCSE preparation.'
  },
  {
    id: 'cal-8',
    title: 'KPSEA & KCSE National Examinations',
    date: '2026-10-26',
    endDate: '2026-11-20',
    category: 'exam' as const,
    term: 3,
    description: 'Kenya Primary School Education Assessment (KPSEA) and KCSE national examinations administered nationwide.'
  }
];
