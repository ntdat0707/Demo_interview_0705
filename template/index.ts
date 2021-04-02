import handlebars from 'handlebars';

interface IBaseEmailTemplate {
  [name: string]: any;
}
/**
 * Build a HTML template
 *
 * @param {string} source
 * @param {IBaseEmailTemplate} data
 * @returns {string}
 */
const buildEmailTemplate = (source: string, data: IBaseEmailTemplate): string => {
  const template = handlebars.compile(source);
  const result = template(data);
  return result;
};

export { buildEmailTemplate, IBaseEmailTemplate };
