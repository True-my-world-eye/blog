# 该脚本用于将 Markdown 文件中的 asset_img 标签格式转换回标准的 Markdown 图片引用语法
# 例如，将 {% asset_img path alt %} 转换为 ![alt](path)
import re
import os

def revert_image_tags(input_file, output_file=None):
    """
    将 asset_img 标签格式转换回 Markdown 中的标准图片引用
    :param input_file: 输入的 Markdown 文件路径
    :param output_file: 输出文件路径，默认覆盖原文件
    :return: 转换统计信息 (原始数量, 转换数量)
    """
    # 如果未指定输出文件，默认覆盖原文件
    if output_file is None:
        output_file = input_file

    # 读取原文件内容
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"错误：文件 {input_file} 不存在")
        return (0, 0)
    except Exception as e:
        print(f"读取文件失败：{str(e)}")
        return (0, 0)

    # 匹配 asset_img 标签格式：{% asset_img path alt %}
    # 正则表达式说明：
    # {% asset_img 捕获标签开始
    # (\S+) 捕获路径（非空白字符）
    # (.*?) 捕获可能的描述文本（懒惰匹配）
    # %} 捕获标签结束
    pattern = r'{%\s*asset_img\s+(\S+)\s*(.*?)\s*%}'
    
    # 统计原始 asset_img 标签数量
    original_count = len(re.findall(pattern, content))
    
    # 替换为 Markdown 图片语法：![alt](path)
    def replace_func(match):
        path = match.group(1)  # 第一个捕获组是路径
        alt = match.group(2).strip()  # 第二个捕获组是描述文本
        return f'![{alt}]({path})'
    
    converted_content = re.sub(pattern, replace_func, content)
    
    # 统计转换后的标签数量（验证替换结果）
    converted_count = len(re.findall(r'!\[[^\]]*\]\([^)]*\)', converted_content))

    # 写入转换后的内容
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(converted_content)
    except Exception as e:
        print(f"写入文件失败：{str(e)}")
        return (original_count, 0)

    return (original_count, converted_count)

if __name__ == "__main__":
    # 输入文件路径
    input_path = input("请输入文件路径：")
    # 如需保留原文件，可指定不同的输出路径，例如：
    # output_path = "markdown_reverted.md"
    output_path = None  # 设为 None 则覆盖原文件

    # 执行转换
    original, converted = revert_image_tags(input_path, output_path)

    # 输出结果统计
    print("转换完成！")
    print(f"原始 asset_img 标签数量: {original}")
    print(f"转换后的 Markdown 图片引用数量: {converted}")

    if original != converted:
        print(f"警告：转换前后数量不一致，请检查文件内容")