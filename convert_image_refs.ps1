# 批量转换Markdown图片引用为Hexo asset_img标签格式的PowerShell脚本

# 获取要处理的文件路径
param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

# 检查文件是否存在
if (-not (Test-Path $FilePath)) {
    Write-Error "文件不存在: $FilePath"
    exit 1
}

# 读取文件内容 - 使用UTF-8编码
$content = Get-Content -Path $FilePath -Raw -Encoding UTF8

# 使用正则表达式匹配图片引用并替换为asset_img标签
$pattern = '!\[(.*?)\]\(\./?(.*?\.(?:png|jpg|jpeg|gif|svg|webp))\)'
$replacement = '{% asset_img "$2" "$1" %}'

# 执行替换
$newContent = [regex]::Replace($content, $pattern, $replacement)

# 计算替换的数量
$originalMatches = [regex]::Matches($content, $pattern).Count
$newMatches = [regex]::Matches($newContent, '{% asset_img').Count

# 将新内容写回文件 - 使用UTF-8编码
Set-Content -Path $FilePath -Value $newContent -Encoding UTF8

# 输出结果
Write-Output "Conversion completed!"
Write-Output "Original image references count: $originalMatches"
Write-Output "Converted asset_img tags count: $newMatches"