export interface ResponseDto {
  data: Object;
  message: string;
  status: string;
  success: boolean
}


export interface ResponseDtoError {
  data: {
    errors?: { field: string; message: string }[];
    [key: string]: any;
  };
  message: string;
  status: string;
  success: boolean
}
