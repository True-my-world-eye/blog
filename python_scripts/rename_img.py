import os
import re

# 此脚本用于清理图片文件名，移除中文字符、空格和"屏幕截图"字样
# 适用于从中文环境截图或下载的图片文件

def clean_image_filenames(folder_path):
    """
    清理文件夹内图片文件名：
    1. 移除"屏幕截图"字符
    2. 移除所有空格
    3. 移除所有中文字符
    4. 保留英文、数字和常用符号（如-_.）
    
    :param folder_path: 目标文件夹路径
    :return: 处理结果统计 (总文件数, 处理成功数, 处理失败数)
    """
    # 定义常见图片文件扩展名
    image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.tiff')
    
    total = 0
    success = 0
    failed = 0
    
    # 检查文件夹是否存在
    if not os.path.isdir(folder_path):
        print(f"错误：文件夹 '{folder_path}' 不存在")
        return (total, success, failed)
    
    # 遍历文件夹内所有文件
    for filename in os.listdir(folder_path):
        # 跳过子文件夹，只处理文件
        file_path = os.path.join(folder_path, filename)
        if os.path.isdir(file_path):
            continue
            
        total += 1
        # 检查是否为图片文件
        if filename.lower().endswith(image_extensions):
            # 获取文件名和扩展名
            name, ext = os.path.splitext(filename)
            
            # 检查文件名是否需要处理（包含"屏幕截图"、空格或中文字符）
            has_chinese = any('\u4e00' <= char <= '\u9fff' for char in name)
            has_spaces = ' ' in name
            
            if "屏幕截图" in name or has_spaces or has_chinese:
                # 移除"屏幕截图"字符
                name = name.replace("屏幕截图", "")
                
                # 移除空格
                name = name.replace(" ", "")
                
                # 移除其他中文字符（保留英文、数字和常用符号）
                name = re.sub(r'[^\w\-_.]+', '', name, flags=re.ASCII)
                
                # 组合新文件名
                new_filename = name + ext
                
                # 处理新文件名为空的特殊情况
                if not name:
                    print(f"跳过：原文件 '{filename}' 去除后文件名为空")
                    failed += 1
                    continue
                
                new_file_path = os.path.join(folder_path, new_filename)
                
                # 处理文件名冲突（如果新文件名已存在）
                counter = 1
                while os.path.exists(new_file_path):
                    # 分离文件名和扩展名
                    name, ext = os.path.splitext(new_filename)
                    new_filename = f"{name}_{counter}{ext}"
                    new_file_path = os.path.join(folder_path, new_filename)
                    counter += 1
                
                # 执行重命名
                try:
                    os.rename(file_path, new_file_path)
                    print(f"已重命名：{filename} -> {new_filename}")
                    success += 1
                except Exception as e:
                    print(f"重命名失败 '{filename}'：{str(e)}")
                    failed += 1
            else:
                # 文件名不需要处理，无需修改
                continue
        else:
            # 非图片文件，跳过
            continue
    
    return (total, success, failed)

if __name__ == "__main__":
    # 目标文件夹路径（可修改为实际路径）
    # 示例：处理脚本所在目录的图片
    # target_folder = "."  # 当前目录
    target_folder = input("请输入目标文件夹路径：")
    # 如果未输入，使用默认路径
    if not target_folder:
        target_folder = "G:\\myblog\\source\\_posts\\python1"
    
    total, success, failed = clean_image_filenames(target_folder)
    
    print("\n处理完成！")
    print(f"总文件数：{total}")
    print(f"成功处理：{success}")
    print(f"处理失败：{failed}")