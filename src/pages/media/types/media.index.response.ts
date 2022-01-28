import type { PaginationResponse } from '@/types/PaginationResponse';
import type { MediaEntity } from '@/pages/media/types/media.entity';

export interface MediaIndexResponse extends PaginationResponse<MediaEntity[]> {}
