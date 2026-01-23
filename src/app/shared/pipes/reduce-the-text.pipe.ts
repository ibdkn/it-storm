import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reduceTheText',
    standalone: false
})
export class ReduceTheTextPipe implements PipeTransform {

  transform(value: string): string {
    let str = value.slice(0, 130);
    let a = str.split(' ');
    a.splice(a.length-1,1);
    str = a.join(' ');
    return str + ' ...'
  }

}
