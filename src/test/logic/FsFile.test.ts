import { writeFileSync, mkdir, mkdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { FsFile } from './../../logic/FsFile';

describe('test FsFile', () => {
  const dir = join(tmpdir(), 'fsfile');

  beforeAll(() => {
    mkdirSync(dir, { recursive: true });
  });

  afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  it('test insert string in middle', () => {
    const path = join(dir, 'test1');
    const content = 'aaa\nbbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    file.insertString(5, 'ttt');
    expect(file.getContent()).toBe('aaa\nbtttbb ccc\nddd');
  });

  it('test insert string in begining', () => {
    const path = join(dir, 'test2');
    const content = 'aaa\nbbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    file.insertString(0, 'ttt');
    expect(file.getContent()).toBe('tttaaa\nbbb ccc\nddd');
  });

  it('test insert string in end', () => {
    const path = join(dir, 'test3');
    const content = 'aaa\nbbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    file.insertString(content.length, 'ttt');
    expect(file.getContent()).toBe('aaa\nbbb ccc\ndddttt');
  });

  it('test startLineWithText', () => {
    const path = join(dir, 'test4');
    const content = 'aaa\nbbb ccc\n ddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getStartOfLinePositionWithText('bbb')).toBe(4);
    expect(file.getStartOfLinePositionWithText('ccc')).toBe(4);
    expect(file.getStartOfLinePositionWithText('ddd')).toBe(12);
  });

  it('test insert indented string in middle', () => {
    const path = join(dir, 'test1');
    const content = 'aaa\nbbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    file.insertStringIndentedWithNewLine(4, 'ttt', '  ');
    expect(file.getContent()).toBe('aaa\n  ttt\nbbb ccc\nddd');
  });

  it('test insert indented double line string in middle', () => {
    const path = join(dir, 'test5');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    file.insertStringIndentedWithNewLine(4, 'ttt\niii', '  ');
    expect(file.getContent()).toBe('aaa\n  ttt\n  iii\n  bbb ccc\nddd');
  });

  it('test append indented double line string in middle', () => {
    const path = join(dir, 'test6');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    file.appendIndentedWithNewLine('ttt\niii', '  ');
    expect(file.getContent()).toBe('aaa\n  bbb ccc\nddd\n  ttt\n  iii');
  });

  it('test get line indent from middle', () => {
    const path = join(dir, 'test6');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getLineIndent(5)).toBe('  ');
  });

  it('test get line indent from beginging', () => {
    const path = join(dir, 'test7');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getLineIndent(0)).toBe('');
  });

  it('test get next line position begin', () => {
    const path = join(dir, 'test7');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getNextLinePosition(0)).toBe(4);
  });

  it('test get next line position middle', () => {
    const path = join(dir, 'test8');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getNextLinePosition(6)).toBe(14);
  });

  it('test get next line position end', () => {
    const path = join(dir, 'test8');
    const content = 'aaa\n  bbb ccc\nddd';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getNextLinePosition(15)).toBe(-1);
  });

  it('test get next line position end with end of line', () => {
    const path = join(dir, 'test8');
    const content = 'aaa\n  bbb ccc\nddd\n';
    writeFileSync(path, content);
    const file = new FsFile(path, '\n');
    expect(file.getNextLinePosition(15)).toBe(18);
  });
});
