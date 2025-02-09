export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  followers: string;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export const characters: Character[] = [
  {
    id: 'solomon',
    name: 'King Solomon',
    image: '/solomon-icon.jpg',
    description: 'The wisest king who ever lived',
    followers: '352.4k'
  },
  {
    id: 'david',
    name: 'King David',
    image: '/david-icon.jpg',
    description: 'A man after God\'s own heart',
    followers: '289.1k'
  },
  {
    id: 'paul',
    name: 'abraham-icon',
    image: '/paul-icon.jpg',
    description: 'The great apostle to the Gentiles',
    followers: '421.3k'
  },
  {
    id: 'moses',
    name: 'Moses',
    image: '/moses-icon.jpg',
    description: 'The great lawgiver and deliverer',
    followers: '385.2k'
  },
  {
    id: 'abraham',
    name: 'Abraham',
    image: '/abraham-icon.jpg',
    description: 'Father of faith and nations',
    followers: '312.8k'
  },
  {
    id: 'peter',
    name: 'Apostle Peter',
    image: '/peter-icon.jpg',
    description: 'The rock of the early church',
    followers: '298.6k'
  },
  {
    id: 'daniel',
    name: 'Daniel',
    image: '/daniel-icon.jpg',
    description: 'Prophet of dreams and visions',
    followers: '276.4k'
  },
  {
    id: 'john',
    name: 'Apostle John',
    image: '/john-icon.jpg',
    description: 'The disciple whom Jesus loved',
    followers: '265.9k'
  },
  {
    id: 'joseph',
    name: 'Joseph',
    image: '/joseph-icon.jpg',
    description: 'From prisoner to prince',
    followers: '254.3k'
  },
  {
    id: 'esther',
    name: 'Queen Esther',
    image: '/esther-icon.jpg',
    description: 'Courage that saved a nation',
    followers: '243.7k'
  }
];

export const topics: Topic[] = [
  {
    id: 'wisdom',
    title: 'Wisdom & Knowledge',
    icon: 'psychology',
    description: 'Biblical principles for wise living'
  },
  {
    id: 'love',
    title: 'Love & Relationships',
    icon: 'favorite',
    description: 'Understanding godly relationships'
  },
  {
    id: 'faith',
    title: 'Faith & Belief',
    icon: 'church',
    description: 'Growing stronger in faith'
  },
  {
    id: 'prayer',
    title: 'Prayer & Worship',
    icon: 'volunteer_activism',
    description: 'Deepening your spiritual life'
  },
  {
    id: 'leadership',
    title: 'Leadership',
    icon: 'group',
    description: 'Biblical principles of leadership'
  },
  {
    id: 'purpose',
    title: 'Purpose & Calling',
    icon: 'explore',
    description: 'Discovering God\'s plan for you'
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness & Grace',
    icon: 'healing',
    description: 'Finding peace through forgiveness'
  },
  {
    id: 'family',
    title: 'Family Life',
    icon: 'family_restroom',
    description: 'Building strong families'
  },
  {
    id: 'prosperity',
    title: 'Success & Prosperity',
    icon: 'trending_up',
    description: 'Biblical view of success'
  },
  {
    id: 'warfare',
    title: 'Spiritual Warfare',
    icon: 'security',
    description: 'Standing firm in faith'
  }
]; 