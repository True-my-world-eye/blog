# 该脚本用于将 Markdown 文件中的图片引用从标准语法转换为特定的 asset_img 标签格式
# 例如，将 ![alt](path) 转换为 {% asset_img path alt %}
import re
import os

def convert_image_tags(input_file, output_file=None):
    """
    将 Markdown 中的图片引用转换为 asset_img 标签格式
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

    # 匹配 Markdown 图片语法：![alt](path)
    # 正则表达式说明：
    # !\[([^\]]*)\] 匹配 ![alt] 部分，捕获 alt 文本
    # \(([^)]*)\) 匹配 (path) 部分，捕获图片路径
    pattern = r'!\[([^\]]*)\]\(([^)]*)\)'
    
    # 统计原始图片引用数量
    original_count = len(re.findall(pattern, content))
    
    # 替换为 asset_img 标签格式：{% asset_img 路径 描述 %}
    converted_content = re.sub(
        pattern,
        r'{% asset_img \2 \1 %}',  # \2 是路径，\1 是 alt 文本
        content
    )
    
    # 统计转换后的标签数量（验证替换结果）
    converted_count = len(re.findall(r'{% asset_img [^%]+ %}', converted_content))

    # 写入转换后的内容
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(converted_content)
    except Exception as e:
        print(f"写入文件失败：{str(e)}")
        return (original_count, 0)

    return (original_count, converted_count)

if __name__ == "__main__":
    # 输入文件路径（根据你的需求修改）
    # input_path = "G:\myblog\source\_posts\python_study.md"
    input_path = input("请输入文件路径：")
    # 如需保留原文件，可指定不同的输出路径，例如：
    # output_path = "python_study_converted.md"
    output_path = None  # 设为 None 则覆盖原文件

    # 执行转换
    original, converted = convert_image_tags(input_path, output_path)

    # 输出结果统计
    print("Conversion completed!")
    print(f"Original image references count: {original}")
    print(f"Converted asset_img tags count: {converted}")

    if original != converted:
        print(f"警告：转换前后数量不一致，请检查文件内容")