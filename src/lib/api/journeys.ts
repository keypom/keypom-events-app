export interface Step {
  description: string;
  completed: boolean;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  steps: Step[];
  tokenReward?: string;
  isDisabled: boolean;
  completed: boolean;
}
