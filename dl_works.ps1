
$wc = New-Object System.Net.WebClient
$wc.Headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"

$items = @(
    "work1.jpg|https://images.unsplash.com/photo-1548614606-52b4451f994b?w=600&q=80",
    "work2.jpg|https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=600&q=80",
    "work3.jpg|https://images.unsplash.com/photo-1508821430073-57c793ba64e1?w=600&q=80",
    "work4.jpg|https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80"
)

foreach ($item in $items) {
    $parts = $item -split "\|"
    $name = $parts[0]
    $url = $parts[1]
    $outFile = "d:\svt\" + $name
    Write-Host "Downloading $name from $url"
    try {
        $wc.DownloadFile($url, $outFile)
        $size = (Get-Item $outFile).Length
        Write-Host "  OK - $size bytes"
    } catch {
        Write-Host "  FAILED: $_"
    }
}
Write-Host "Done!"
