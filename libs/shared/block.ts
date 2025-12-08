export enum BlockType {
  // Basic blocks
  PARAGRAPH = 'paragraph',
  HEADING_1 = 'heading_1',
  HEADING_2 = 'heading_2',
  HEADING_3 = 'heading_3',
  BULLETED_LIST = 'bulleted_list',
  NUMBERED_LIST = 'numbered_list',
  TODO_LIST = 'todo_list',
  QUOTE = 'quote',
  CODE = 'code',
  DIVIDER = 'divider',
  
  // Advanced blocks
  CALLOUT = 'callout',
  TOGGLE = 'toggle',
  EQUATION = 'equation',
  IMAGE = 'image',
  EMBED = 'embed',
  BOOKMARK = 'bookmark',
  
  // Database blocks
  DATABASE = 'database',
  DATABASE_ROW = 'database_row',
  
  // Template blocks
  TEMPLATE = 'template',
}

export interface BlockData {
  text?: string;
  checked?: boolean;
  language?: string;
  icon?: string;
  calloutType?: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';
  color?: string;
  url?: string;
  caption?: string;
  formula?: string;
  properties?: Record<string, any>;
  items?: { id: string; text: string; checked?: boolean }[];
  expanded?: boolean;
  children?: Block[];
}

export interface Block {
  id: string;
  type: BlockType;
  data: BlockData;
  children: Block[];
  parentId?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  collapsed?: boolean;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: PropertyType;
  options?: SelectOption[];
  formula?: string;
}

export enum PropertyType {
  TITLE = 'title',
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  CHECKBOX = 'checkbox',
  URL = 'url',
  EMAIL = 'email',
  PHONE = 'phone',
  FORMULA = 'formula',
  RELATION = 'relation',
  FILE = 'file',
  CREATED_TIME = 'created_time',
  UPDATED_TIME = 'updated_time',
}

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export interface DatabaseBlock extends Block {
  type: BlockType.DATABASE;
  data: BlockData & {
    properties: DatabaseProperty[];
    views: DatabaseView[];
    rows: string[]; // Block IDs of database_row blocks
  };
}

export interface DatabaseView {
  id: string;
  name: string;
  type: ViewType;
  properties: string[]; // Property IDs to display
  filter?: FilterGroup;
  sort?: SortConfig[];
  groupBy?: string; // Property ID to group by
}

export enum ViewType {
  TABLE = 'table',
  BOARD = 'board',
  CALENDAR = 'calendar',
  GALLERY = 'gallery',
  LIST = 'list',
  TIMELINE = 'timeline',
}

export interface FilterGroup {
  operator: 'and' | 'or';
  conditions: FilterCondition[];
  groups?: FilterGroup[];
}

export interface FilterCondition {
  propertyId: string;
  operator: FilterOperator;
  value: any;
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  IS_CHECKED = 'is_checked',
  IS_NOT_CHECKED = 'is_not_checked',
}

export interface SortConfig {
  propertyId: string;
  direction: 'asc' | 'desc';
}

export interface TemplateBlock extends Block {
  type: BlockType.TEMPLATE;
  data: BlockData & {
    templateId: string;
    category: string;
    description: string;
    icon: string;
    isPublic: boolean;
  };
}
