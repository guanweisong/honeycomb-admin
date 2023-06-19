import type { EnableType } from '@/types/EnableType';
import type { BaseEntity } from '@/types/BaseEntity';

export interface LinkEntity extends BaseEntity {
  id: string;
  url: string;
  name: string;
  description: string;
  status: EnableType;
}
