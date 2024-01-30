import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  getInfo(@Query('searchText') searchText: string): Promise<any> {
    return this.searchService.searchUsers(searchText);
  }
}
