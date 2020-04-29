Name:       rpm-test
Version:    1.0.5
Release:    1
Summary:    Most simple RPM package
License:    FIXME

%description
Test RPM

# %prep
# # %setup -q -n %{name}-%{version}
# echo "pwd $PWD"
# echo "env $ENV"
# echo "RPM_BUILD_ROOT $RPM_BUILD_ROOT"

# %build
# # go build -a --ldflags '-extldflags "-static"' ./SOURCE/
# echo "pwd $PWD"
# echo "env $ENV"
# echo "RPM_BUILD_ROOT $RPM_BUILD_ROOT"

# ls -aFl

%install
# [ "$RPM_BUILD_ROOT" != "/" ] && rm -rf $RPM_BUILD_ROOT

# make DESTDIR=$RPM_BUILD_ROOT install
# rm -rf $RPM_BUILD_ROOT%{_datadir}/doc/%{name}

# echo "install"
# mv $RPM_BUILD_ROOT/test /usr/bin/.
# chmod +x /usr/bin/test
# /usr/bin/test

echo "buildroot: %{buildroot}"

mkdir -p %{buildroot}/usr/bin/
mkdir -p %{buildroot}/usr/local/testdata

install -m 755 test %{buildroot}/usr/bin/rpm-test
install -d -m 755 data %{buildroot}/usr/local/testdata/
# install -m 440 test %{buildroot}/usr/bin/112
# install -m 440 test %{buildroot}/usr/bin/113
# install -m 440 test %{buildroot}/usr/bin/114

%clean

# echo "install"
# $RPM_BUILD_ROOT/test


[ "$RPM_BUILD_ROOT" != "/" ] && rm -rf $RPM_BUILD_ROOT

%files

/usr/bin/rpm-test
/usr/local/testdata
# /usr/bin/111
# /usr/bin/112
# /usr/bin/113
# /usr/bin/114


# %defattr(-,root,root)
# %doc README AUTHORS COPYING NEWS TODO ChangeLog
# %doc doc/*.html
# %doc doc/*.jpg
# %doc doc/*.css
# %config(noreplace) /etc/%{name}.xml
# %{_bindir}/icecast
# %{_prefix}/share/icecast/*

%changelog

* Tue Jan 24 2012 Laisky

yahoo
