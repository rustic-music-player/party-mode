FROM rust:buster

RUN cargo install sccache
RUN cargo install cargo-tarpaulin
ENV RUSTC_WRAPPER=/usr/local/cargo/bin/sccache
ENV SCCACHE_DIR=/build_cache/sccache
