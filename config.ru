# use Rack::Static,
#   :urls => ["/assets/img", "/assets/js", "/assets/css"],
#   :root => "night-cyc-prototype/dist"
#
# run lambda { |env|
#   [
#     200,
#     {
#       #'Content-Type'  => 'text/html'
#       #'Cache-Control' => 'public, max-age=86400'
#     },
#     File.open('night-cyc-prototype/dist/index.html', File::RDONLY)
#   ]
# }
require './app'
run Sinatra::Application
