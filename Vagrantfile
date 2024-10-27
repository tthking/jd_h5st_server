Vagrant.configure("2") do |config|
  config.vm.box = "debian/bookworm64"

  config.vm.network "private_network", ip: "192.168.56.2"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "jd_server_nestjs"
    vb.cpus = 2
    vb.memory = "2048"
  end

  config.vm.provision "shell", inline: <<-SHELL
      # 自动切换到root用户
      echo "sudo su -" >> .bashrc
  SHELL

  config.vm.provision "shell", privileged: true, inline: <<-SHELL
      # 设置root用户，密码root
      echo "root:root" | chpasswd
      sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
      sed -i 's/^PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
      sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
      sed -i 's/^PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
      systemctl restart sshd

      # 时间自动更新
      apt-get update
      apt-get upgrade
      apt-get install -y chrony curl vim wget
      timedatectl set-timezone Asia/Shanghai
      echo "server cn.pool.ntp.org iburst" >> /etc/chrony/chrony.conf
      systemctl restart chronyd
      # 在root用户的bashrc中添加首次登录时的时间同步
      echo "chronyc -a makestep" >> /root/.bashrc

      # 安装 Docker
      curl -fsSL https://get.docker.com -o get-docker.sh
      sh get-docker.sh

      # 配置 Docker 使用 TCP 监听
      mkdir -p /etc/systemd/system/docker.service.d
      echo '[Service]' >> /etc/systemd/system/docker.service.d/override.conf
      echo 'ExecStart=' >> /etc/systemd/system/docker.service.d/override.conf
      echo 'ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375' >> /etc/systemd/system/docker.service.d/override.conf
      systemctl daemon-reload
      systemctl restart docker
  SHELL
end
